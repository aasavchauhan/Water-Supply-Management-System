package com.watersupply.data.firebase;

import android.util.Log;

import androidx.lifecycle.LiveData;

import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.MetadataChanges;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QuerySnapshot;

import java.util.ArrayList;
import java.util.List;

/**
 * A LiveData class that observes a Firestore Query and handles listener lifecycle.
 * It enables MetadataChanges to support immediate local updates (latency compensation).
 *
 * @param <T> The model class to convert documents to.
 */
public class FirestoreQueryLiveData<T> extends LiveData<List<T>> {
    private static final String TAG = "FirestoreQueryLiveData";

    private final Query query;
    private final Class<T> type;
    private ListenerRegistration registration;

    private final EventListener<QuerySnapshot> listener = new EventListener<QuerySnapshot>() {
        @Override
        public void onEvent(QuerySnapshot querySnapshot, FirebaseFirestoreException e) {
            if (e != null) {
                Log.e(TAG, "Listen failed.", e);
                setValue(new ArrayList<>()); // Return empty list on error
                return;
            }

            if (querySnapshot != null) {
                List<T> items = querySnapshot.toObjects(type);
                setValue(items);
            }
        }
    };

    public FirestoreQueryLiveData(Query query, Class<T> type) {
        this.query = query;
        this.type = type;
    }

    @Override
    protected void onActive() {
        super.onActive();
        // Listen for metadata changes to get immediate updates for local writes
        registration = query.addSnapshotListener(MetadataChanges.INCLUDE, listener);
    }

    @Override
    protected void onInactive() {
        super.onInactive();
        if (registration != null) {
            registration.remove();
            registration = null;
        }
    }
}

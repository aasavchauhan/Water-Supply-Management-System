package com.watersupply.data.firebase;

import android.util.Log;

import androidx.lifecycle.LiveData;

import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.EventListener;
import com.google.firebase.firestore.FirebaseFirestoreException;
import com.google.firebase.firestore.ListenerRegistration;
import com.google.firebase.firestore.MetadataChanges;

/**
 * A LiveData class that observes a Firestore Document and handles listener lifecycle.
 * It enables MetadataChanges to support immediate local updates.
 *
 * @param <T> The model class to convert the document to.
 */
public class FirestoreDocumentLiveData<T> extends LiveData<T> {
    private static final String TAG = "FirestoreDocLiveData";

    private final DocumentReference documentReference;
    private final Class<T> type;
    private ListenerRegistration registration;

    private final EventListener<DocumentSnapshot> listener = new EventListener<DocumentSnapshot>() {
        @Override
        public void onEvent(DocumentSnapshot documentSnapshot, FirebaseFirestoreException e) {
            if (e != null) {
                Log.e(TAG, "Listen failed.", e);
                setValue(null);
                return;
            }

            if (documentSnapshot != null && documentSnapshot.exists()) {
                try {
                    T item = documentSnapshot.toObject(type);
                    setValue(item);
                } catch (RuntimeException re) {
                    Log.e(TAG, "Deserialization failed", re);
                    setValue(null);
                }
            } else {
                setValue(null);
            }
        }
    };

    public FirestoreDocumentLiveData(DocumentReference documentReference, Class<T> type) {
        this.documentReference = documentReference;
        this.type = type;
    }

    @Override
    protected void onActive() {
        super.onActive();
        registration = documentReference.addSnapshotListener(MetadataChanges.INCLUDE, listener);
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

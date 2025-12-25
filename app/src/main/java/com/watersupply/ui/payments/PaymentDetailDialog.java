package com.watersupply.ui.payments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.watersupply.databinding.DialogPaymentDetailBinding;
import com.watersupply.data.models.Payment;
import com.watersupply.data.repository.PaymentRepository;
import com.watersupply.utils.CurrencyFormatter;
import com.watersupply.utils.DateFormatter;
import dagger.hilt.android.AndroidEntryPoint;
import javax.inject.Inject;

@AndroidEntryPoint
public class PaymentDetailDialog extends BottomSheetDialogFragment {
    private DialogPaymentDetailBinding binding;
    private String paymentId;
    
    @Inject
    PaymentRepository paymentRepository;
    
    public static PaymentDetailDialog newInstance(String paymentId) {
        PaymentDetailDialog dialog = new PaymentDetailDialog();
        Bundle args = new Bundle();
        args.putString("payment_id", paymentId);
        dialog.setArguments(args);
        return dialog;
    }
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = DialogPaymentDetailBinding.inflate(inflater, container, false);
        
        if (getArguments() != null) {
            paymentId = getArguments().getString("payment_id");
        }
        
        loadPaymentDetails();
        
        binding.btnEdit.setOnClickListener(v -> {
            if (currentPayment != null) {
                android.content.Intent intent = new android.content.Intent(requireContext(), AddPaymentActivity.class);
                intent.putExtra("payment", currentPayment);
                startActivity(intent);
                dismiss();
            }
        });
        
        binding.btnDelete.setOnClickListener(v -> {
            if (currentPayment != null) {
                new com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext())
                    .setTitle("Delete Payment")
                    .setMessage("Are you sure you want to delete this payment? This will revert the farmer's balance.")
                    .setPositiveButton("Delete", (dialog, which) -> {
                        paymentRepository.deletePayment(currentPayment);
                        android.widget.Toast.makeText(requireContext(), "Payment deleted", android.widget.Toast.LENGTH_SHORT).show();
                        dismiss();
                    })
                    .setNegativeButton("Cancel", null)
                    .show();
            }
        });
        
        return binding.getRoot();
    }
    
    private void loadPaymentDetails() {
        paymentRepository.getPaymentById(paymentId).observe(getViewLifecycleOwner(), payment -> {
            if (payment != null) {
                displayPaymentDetails(payment);
            }
        });
    }
    
    private Payment currentPayment;

    private void displayPaymentDetails(Payment payment) {
        this.currentPayment = payment;
        binding.tvPaymentDate.setText(DateFormatter.formatDate(payment.getPaymentDate()));
        binding.tvAmount.setText(CurrencyFormatter.format(payment.getAmount()));
        binding.tvPaymentMethod.setText(payment.getPaymentMethod());
        
        if (payment.getTransactionId() != null && !payment.getTransactionId().isEmpty()) {
            binding.tvTransactionId.setVisibility(View.VISIBLE);
            binding.tvTransactionId.setText("Txn: " + payment.getTransactionId());
        } else {
            binding.tvTransactionId.setVisibility(View.GONE);
        }
        
        if (payment.getRemarks() != null && !payment.getRemarks().isEmpty()) {
            binding.tvRemarks.setVisibility(View.VISIBLE);
            binding.tvRemarks.setText(payment.getRemarks());
        } else {
            binding.tvRemarks.setVisibility(View.GONE);
        }
        
        if (payment.getCreatedAt() != null) {
            binding.tvCreatedAt.setText("Recorded on " + 
                DateFormatter.format(payment.getCreatedAt().getTime(), "dd MMM yyyy, hh:mm a"));
        }
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}

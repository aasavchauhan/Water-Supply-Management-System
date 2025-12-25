package com.watersupply.ui.dashboard;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;
import com.github.mikephil.charting.formatter.ValueFormatter;
import com.watersupply.R;
import com.watersupply.databinding.FragmentDashboardBinding;
import com.watersupply.ui.farmers.FarmerListActivity;
import com.watersupply.ui.supply.SupplyListActivity;
import com.watersupply.ui.payments.PaymentListActivity;
import com.watersupply.utils.CurrencyFormatter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import dagger.hilt.android.AndroidEntryPoint;

/**
 * Dashboard fragment showing stats and quick actions
 */
@AndroidEntryPoint
public class DashboardFragment extends Fragment {
    
    private FragmentDashboardBinding binding;
    private DashboardViewModel viewModel;
    private String chartPeriod = "week";
    
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentDashboardBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }
    
    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        
        viewModel = new ViewModelProvider(this).get(DashboardViewModel.class);
        
        setupClickListeners();
        setupCharts();
        setupDrafts();
        observeStats();
        observePeriodComparison();
        observeChartData();
    }
    
    private void setupDrafts() {
        DraftAdapter draftAdapter = new DraftAdapter(entry -> {
            Intent intent = new Intent(requireContext(), com.watersupply.ui.supply.NewSupplyActivity.class);
            intent.putExtra("supply_entry", entry);
            startActivity(intent);
        });
        
        binding.rvDrafts.setLayoutManager(new androidx.recyclerview.widget.LinearLayoutManager(requireContext()));
        binding.rvDrafts.setAdapter(draftAdapter);
        
        viewModel.getDraftSupplyEntries().observe(getViewLifecycleOwner(), drafts -> {
            if (drafts != null && !drafts.isEmpty()) {
                binding.layoutDrafts.setVisibility(View.VISIBLE);
                draftAdapter.submitList(drafts);
            } else {
                binding.layoutDrafts.setVisibility(View.GONE);
            }
        });
    }
    
    private void setupClickListeners() {
        binding.cardFarmers.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), FarmerListActivity.class);
            startActivity(intent);
        });
        
        binding.cardWaterSupplied.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), SupplyListActivity.class);
            startActivity(intent);
        });
        
        binding.cardTotalIncome.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), PaymentListActivity.class);
            startActivity(intent);
        });
        
        binding.cardPendingDues.setOnClickListener(v -> {
            Intent intent = new Intent(requireContext(), FarmerListActivity.class);
            startActivity(intent);
        });
    }
    
    private void observeStats() {
        viewModel.getFarmerCount().observe(getViewLifecycleOwner(), count -> {
            binding.tvFarmerCount.setText(count != null ? String.valueOf(count) : "0");
        });
        
        viewModel.getSupplyEntryCount().observe(getViewLifecycleOwner(), count -> {
            binding.tvWaterSupplied.setText(count != null ? String.valueOf(count) : "0");
        });
        
        viewModel.getTotalIncomeCollected().observe(getViewLifecycleOwner(), income -> {
            binding.tvTotalIncome.setText(income != null ? 
                CurrencyFormatter.format(income) : "₹0.00");
        });
        
        viewModel.getPendingDues().observe(getViewLifecycleOwner(), dues -> {
            binding.tvPendingDues.setText(dues != null ? 
                CurrencyFormatter.format(Math.abs(dues)) : "₹0.00");
        });
    }
    
    private void setupCharts() {
        binding.revenueChart.getDescription().setEnabled(false);
        binding.revenueChart.setTouchEnabled(true);
        binding.revenueChart.setDragEnabled(true);
        binding.revenueChart.setScaleEnabled(false);
        binding.revenueChart.setDrawGridBackground(false);
        binding.revenueChart.setPinchZoom(false);
        binding.revenueChart.setExtraBottomOffset(10f);
        
        binding.btnWeekly.setOnClickListener(v -> {
            chartPeriod = "week";
            binding.btnWeekly.setBackgroundColor(getResources().getColor(R.color.md_theme_light_primary, null));
            binding.btnMonthly.setBackgroundColor(getResources().getColor(R.color.md_theme_light_surfaceVariant, null));
            viewModel.loadChartData("week");
        });
        
        binding.btnMonthly.setOnClickListener(v -> {
            chartPeriod = "month";
            binding.btnMonthly.setBackgroundColor(getResources().getColor(R.color.md_theme_light_primary, null));
            binding.btnWeekly.setBackgroundColor(getResources().getColor(R.color.md_theme_light_surfaceVariant, null));
            viewModel.loadChartData("month");
        });
    }
    
    private void observePeriodComparison() {
        // Removed as per new design
    }
    
    private void observeChartData() {
        viewModel.getRevenueTrendData().observe(getViewLifecycleOwner(), data -> {
            if (data != null && !data.isEmpty()) {
                List<Entry> entries = new ArrayList<>();
                List<String> labels = new ArrayList<>();
                
                int index = 0;
                for (Map.Entry<String, Double> entry : data.entrySet()) {
                    entries.add(new Entry(index, entry.getValue().floatValue()));
                    labels.add(entry.getKey());
                    index++;
                }
                
                LineDataSet dataSet = new LineDataSet(entries, "Revenue");
                dataSet.setColor(getResources().getColor(R.color.md_theme_light_primary, null));
                dataSet.setCircleColor(getResources().getColor(R.color.md_theme_light_primary, null));
                dataSet.setLineWidth(2f);
                dataSet.setCircleRadius(4f);
                dataSet.setDrawCircleHole(false);
                dataSet.setValueTextSize(10f);
                dataSet.setDrawFilled(true);
                dataSet.setFillColor(getResources().getColor(R.color.md_theme_light_primaryContainer, null));
                dataSet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
                
                LineData lineData = new LineData(dataSet);
                lineData.setValueFormatter(new ValueFormatter() {
                    @Override
                    public String getFormattedValue(float value) {
                        return "₹" + (int) value;
                    }
                });
                
                binding.revenueChart.setData(lineData);
                binding.revenueChart.getXAxis().setValueFormatter(new IndexAxisValueFormatter(labels));
                binding.revenueChart.getXAxis().setPosition(XAxis.XAxisPosition.BOTTOM);
                binding.revenueChart.getXAxis().setGranularity(1f);
                binding.revenueChart.getAxisRight().setEnabled(false);
                binding.revenueChart.animateY(1000);
                binding.revenueChart.invalidate();
            }
        });
    }
    
    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}

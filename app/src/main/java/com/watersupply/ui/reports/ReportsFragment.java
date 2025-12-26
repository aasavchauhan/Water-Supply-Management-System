package com.watersupply.ui.reports;

import android.app.DatePickerDialog;
import android.content.Intent;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Toast;
import android.graphics.Typeface;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.watersupply.databinding.FragmentReportsBinding;
import com.watersupply.data.models.Farmer;
import com.watersupply.data.models.SupplyEntry;
import com.watersupply.data.models.Payment;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter;

import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class ReportsFragment extends Fragment {

    private FragmentReportsBinding binding;
    private ReportsViewModel viewModel;
    private List<Farmer> farmersList = new ArrayList<>();
    private Farmer selectedFarmer;
    private Calendar startDate = Calendar.getInstance();
    private Calendar endDate = Calendar.getInstance();
    private SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy", Locale.getDefault());
    private java.util.Map<String, String> farmerNameMap = new java.util.HashMap<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentReportsBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    private List<SupplyEntry> allSupplyEntries = new ArrayList<>();
    private List<Payment> allPayments = new ArrayList<>();
    private List<SupplyEntry> filteredSupplyEntries = new ArrayList<>();
    private List<Payment> filteredPayments = new ArrayList<>();

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(ReportsViewModel.class);

        setupDatePickers();
        setupFarmerSelection();
        setupButtons();
        setupChart();
        
        // Set default dates (start of month to today)
        startDate.set(Calendar.DAY_OF_MONTH, 1);
        updateDateFields();
        
        // Initial data fetch (for all farmers)
        fetchData(null);
    }

    private void fetchData(String farmerId) {
        viewModel.getSupplyEntries(farmerId).observe(getViewLifecycleOwner(), entries -> {
            allSupplyEntries = entries != null ? entries : new ArrayList<>();
            calculateAndDisplayTotals();
        });
        
        viewModel.getPayments(farmerId).observe(getViewLifecycleOwner(), payments -> {
            allPayments = payments != null ? payments : new ArrayList<>();
            calculateAndDisplayTotals();
        });
    }

    private void calculateAndDisplayTotals() {
        filteredSupplyEntries.clear();
        filteredPayments.clear();
        
        double totalHours = 0;
        double totalCharges = 0;
        double totalCollection = 0;
        
        Date start = startDate.getTime();
        Date end = endDate.getTime();
        
        // Filter Supply Entries
        for (SupplyEntry entry : allSupplyEntries) {
            try {
                Date entryDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(entry.getDate());
                boolean isDraft = "draft".equalsIgnoreCase(entry.getStatus());
                if (entryDate != null && !isDraft && !entryDate.before(start) && !entryDate.after(end)) {
                    filteredSupplyEntries.add(entry);
                    if (entry.getTotalTimeUsed() != null) totalHours += entry.getTotalTimeUsed();
                    totalCharges += entry.getAmount();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        // Filter Payments
        for (Payment payment : allPayments) {
            try {
                Date paymentDate = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).parse(payment.getPaymentDate());
                if (paymentDate != null && !paymentDate.before(start) && !paymentDate.after(end)) {
                    filteredPayments.add(payment);
                    totalCollection += payment.getAmount();
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        // Update UI
        binding.tvReportTotalHours.setText(String.format("%.1f", totalHours));
        binding.tvReportTotalCharges.setText("₹" + (int)totalCharges);
        binding.tvReportCollection.setText("₹" + (int)totalCollection);
        
        updateChartData();
    }

    private void setupDatePickers() {
        binding.etStartDate.setOnClickListener(v -> showDatePicker(startDate, true));
        binding.etEndDate.setOnClickListener(v -> showDatePicker(endDate, false));
    }

    private void showDatePicker(Calendar calendar, boolean isStart) {
        DatePickerDialog dialog = new DatePickerDialog(requireContext(), (view, year, month, dayOfMonth) -> {
            calendar.set(year, month, dayOfMonth);
            updateDateFields();
            calculateAndDisplayTotals(); // Recalculate on date change
        }, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH));
        dialog.show();
    }

    private void updateDateFields() {
        binding.etStartDate.setText(dateFormat.format(startDate.getTime()));
        binding.etEndDate.setText(dateFormat.format(endDate.getTime()));
    }

    private void setupFarmerSelection() {
        viewModel.getAllFarmers().observe(getViewLifecycleOwner(), farmers -> {
            farmersList = farmers;
            List<String> farmerNames = new ArrayList<>();
            farmerNames.add("All Farmers"); // Add option for all
            farmerNameMap.clear();
            for (Farmer farmer : farmers) {
                farmerNames.add(farmer.getName());
                farmerNameMap.put(farmer.getId(), farmer.getName());
            }
            
            ArrayAdapter<String> adapter = new ArrayAdapter<>(requireContext(), android.R.layout.simple_dropdown_item_1line, farmerNames);
            binding.actvFarmer.setAdapter(adapter);
            binding.actvFarmer.setText("All Farmers", false); // Default
            
            binding.actvFarmer.setOnItemClickListener((parent, view, position, id) -> {
                if (position == 0) {
                    selectedFarmer = null; // All farmers
                    fetchData(null);
                } else {
                    selectedFarmer = farmersList.get(position - 1);
                    fetchData(selectedFarmer.getId());
                }
            });
        });
    }

    private void setupButtons() {
        binding.btnGenerateReport.setOnClickListener(v -> {
            showReportFormatDialog();
        });
        
        binding.btnExportCsv.setOnClickListener(v -> {
             String name = selectedFarmer != null ? selectedFarmer.getName() : "All Farmers";
             exportToCsv(name);
        });
    }
    
    private void showReportFormatDialog() {
        com.google.android.material.dialog.MaterialAlertDialogBuilder builder = new com.google.android.material.dialog.MaterialAlertDialogBuilder(requireContext());
        builder.setTitle("Select Report Format");
        builder.setBackground(androidx.core.content.ContextCompat.getDrawable(requireContext(), android.R.drawable.dialog_holo_light_frame)); // Optional
        
        // Custom View
        android.widget.LinearLayout layout = new android.widget.LinearLayout(requireContext());
        layout.setOrientation(android.widget.LinearLayout.VERTICAL);
        layout.setPadding(50, 20, 50, 20);
        
        // Option 1: Legacy
        com.google.android.material.card.MaterialCardView card1 = new com.google.android.material.card.MaterialCardView(requireContext());
        card1.setCardBackgroundColor(Color.WHITE);
        card1.setStrokeColor(Color.LTGRAY);
        card1.setStrokeWidth(2);
        card1.setRadius(20);
        card1.setClickable(true);
        card1.setFocusable(true);
        
        android.widget.TextView tv1 = new android.widget.TextView(requireContext());
        tv1.setText("Regular Format\n(Legacy)");
        tv1.setPadding(40, 40, 40, 40);
        tv1.setGravity(android.view.Gravity.CENTER);
        tv1.setTextSize(16);
        tv1.setTextColor(Color.BLACK);
        tv1.setTypeface(null, Typeface.BOLD);
        card1.addView(tv1);
        
        // Option 2: Professional
        com.google.android.material.card.MaterialCardView card2 = new com.google.android.material.card.MaterialCardView(requireContext());
        card2.setCardBackgroundColor(Color.parseColor("#e3f2fd"));
        card2.setStrokeColor(Color.parseColor("#0056b3"));
        card2.setStrokeWidth(4);
        card2.setRadius(20);
        card2.setClickable(true);
        card2.setFocusable(true);
        
        android.widget.LinearLayout.LayoutParams params = new android.widget.LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        params.setMargins(0, 0, 0, 30);
        
        android.widget.TextView tv2 = new android.widget.TextView(requireContext());
        tv2.setText("Professional Format\n(New Design)");
        tv2.setPadding(40, 40, 40, 40);
        tv2.setGravity(android.view.Gravity.CENTER);
        tv2.setTextSize(16);
        tv2.setTextColor(Color.parseColor("#0056b3"));
        tv2.setTypeface(null, Typeface.BOLD);
        card2.addView(tv2);
        
        layout.addView(card1, params);
        layout.addView(card2, params);
        
        builder.setView(layout);
        builder.setNegativeButton("Cancel", null);
        
        androidx.appcompat.app.AlertDialog dialog = builder.create();
        
        card1.setOnClickListener(v -> {
            dialog.dismiss();
            generatePdfReport(selectedFarmer != null ? selectedFarmer.getName() : "All Farmers", 
                              startDate.getTime(), endDate.getTime(), binding.cbIncludePayments.isChecked());
        });
        
        card2.setOnClickListener(v -> {
            dialog.dismiss();
            String name = selectedFarmer != null ? selectedFarmer.getName() : "All Farmers";
            String id = selectedFarmer != null ? selectedFarmer.getId() : null;
            
            com.watersupply.utils.ReportGenerator generator = new com.watersupply.utils.ReportGenerator(requireContext());
            generator.generateReport("v1", name, id, startDate.getTime(), endDate.getTime(), filteredSupplyEntries, filteredPayments, farmerNameMap);
            openPdf(generator.getLastReportFile("v1", name));
        });
        
        dialog.show();
    }

    private void exportToCsv(String farmerName) {
        StringBuilder csvData = new StringBuilder();
        csvData.append("Date,Type,Details,Amount\n");
        
        for (SupplyEntry entry : filteredSupplyEntries) {
            csvData.append(entry.getDate()).append(",")
                   .append("Supply").append(",")
                   .append(entry.getTotalTimeUsed()).append(" hrs").append(",")
                   .append(entry.getAmount()).append("\n");
        }
        
        for (Payment payment : filteredPayments) {
            csvData.append(payment.getPaymentDate()).append(",")
                   .append("Payment").append(",")
                   .append(payment.getPaymentMethod()).append(",")
                   .append(payment.getAmount()).append("\n");
        }
        
        try {
            File file = new File(requireContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "Report_" + farmerName + ".csv");
            FileOutputStream out = new FileOutputStream(file);
            out.write(csvData.toString().getBytes());
            out.close();
            Toast.makeText(requireContext(), "CSV saved to " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
            
            // Share CSV
            Uri uri = FileProvider.getUriForFile(requireContext(), requireContext().getPackageName() + ".provider", file);
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/csv");
            intent.putExtra(Intent.EXTRA_STREAM, uri);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivity(Intent.createChooser(intent, "Share CSV"));
            
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(requireContext(), "Error saving CSV", Toast.LENGTH_SHORT).show();
        }
    }

    private void generatePdfReport(String farmerName, Date start, Date end, boolean includePayments) {
        PdfDocument document = new PdfDocument();
        PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(595, 842, 1).create(); // A4 size
        PdfDocument.Page page = document.startPage(pageInfo);

        Canvas canvas = page.getCanvas();
        Paint paint = new Paint();
        paint.setColor(Color.BLACK);
        paint.setTextSize(16);

        // Header
        canvas.drawText("Water Supply Report", 50, 50, paint);
        paint.setTextSize(12);
        canvas.drawText("Farmer: " + farmerName, 50, 80, paint);
        canvas.drawText("Period: " + dateFormat.format(start) + " - " + dateFormat.format(end), 50, 100, paint);

        // Table Header
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(1);
        canvas.drawLine(50, 120, 545, 120, paint);
        
        paint.setStyle(Paint.Style.FILL);
        paint.setFakeBoldText(true);
        
        boolean isAllFarmers = "All Farmers".equals(farmerName);
        
        if (isAllFarmers) {
            canvas.drawText("Date", 50, 140, paint);
            canvas.drawText("Farmer", 130, 140, paint); // New Column
            canvas.drawText("Type", 230, 140, paint);
            canvas.drawText("Details", 300, 140, paint);
            canvas.drawText("Amount", 480, 140, paint);
        } else {
            canvas.drawText("Date", 50, 140, paint);
            canvas.drawText("Type", 150, 140, paint);
            canvas.drawText("Details", 250, 140, paint);
            canvas.drawText("Amount", 450, 140, paint);
        }
        
        paint.setFakeBoldText(false);
        canvas.drawLine(50, 150, 545, 150, paint);

        // Data Rows
        int y = 170;
        
        for (SupplyEntry entry : filteredSupplyEntries) {
            if (y > 800) { // New page needed
                document.finishPage(page);
                page = document.startPage(pageInfo);
                canvas = page.getCanvas();
                y = 50;
            }
            
            if (isAllFarmers) {
                canvas.drawText(entry.getDate(), 50, y, paint);
                
                String fName = entry.getFarmerName();
                if (fName == null && entry.getFarmerId() != null) {
                    fName = farmerNameMap.get(entry.getFarmerId());
                }
                fName = fName != null ? fName : "-";
                
                if (fName.length() > 12) fName = fName.substring(0, 10) + ".."; // Truncate
                canvas.drawText(fName, 130, y, paint);
                canvas.drawText("Supply", 230, y, paint);
                canvas.drawText(String.format("%.1f hrs", entry.getTotalTimeUsed()), 300, y, paint);
                canvas.drawText(String.format("₹%.2f", entry.getAmount()), 480, y, paint);
            } else {
                canvas.drawText(entry.getDate(), 50, y, paint);
                canvas.drawText("Supply", 150, y, paint);
                canvas.drawText(String.format("%.1f hrs", entry.getTotalTimeUsed()), 250, y, paint);
                canvas.drawText(String.format("₹%.2f", entry.getAmount()), 450, y, paint);
            }
            y += 25;
        }
        
        if (includePayments) {
            for (Payment payment : filteredPayments) {
                 if (y > 800) {
                    document.finishPage(page);
                    page = document.startPage(pageInfo);
                    canvas = page.getCanvas();
                    y = 50;
                }
                
                if (isAllFarmers) {
                    canvas.drawText(payment.getPaymentDate(), 50, y, paint);
                    
                    String fName = payment.getFarmerName();
                    if (fName == null && payment.getFarmerId() != null) {
                        fName = farmerNameMap.get(payment.getFarmerId());
                    }
                    fName = fName != null ? fName : "-";
                    if (fName.length() > 12) fName = fName.substring(0, 10) + ".."; // Truncate
                    
                    canvas.drawText(fName, 130, y, paint); 
                    canvas.drawText("Payment", 230, y, paint);
                    canvas.drawText(payment.getPaymentMethod(), 300, y, paint);
                    canvas.drawText(String.format("-₹%.2f", payment.getAmount()), 480, y, paint);
                } else {
                    canvas.drawText(payment.getPaymentDate(), 50, y, paint);
                    canvas.drawText("Payment", 150, y, paint);
                    canvas.drawText(payment.getPaymentMethod(), 250, y, paint);
                    canvas.drawText(String.format("-₹%.2f", payment.getAmount()), 450, y, paint);
                }
                y += 25;
            }
        }

        document.finishPage(page);

        // Save File
        File file = new File(requireContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), "Report_" + farmerName + ".pdf");
        try {
            document.writeTo(new FileOutputStream(file));
            Toast.makeText(requireContext(), "Report saved to " + file.getAbsolutePath(), Toast.LENGTH_LONG).show();
            openPdf(file);
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(requireContext(), "Error saving report: " + e.getMessage(), Toast.LENGTH_SHORT).show();
        }

        document.close();
    }

    private void openPdf(File file) {
        Uri uri = FileProvider.getUriForFile(requireContext(), requireContext().getPackageName() + ".provider", file);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(uri, "application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            startActivity(intent);
        } catch (Exception e) {
            Toast.makeText(requireContext(), "No PDF viewer found", Toast.LENGTH_SHORT).show();
        }
    }

    private void setupChart() {
        LineChart chart = binding.reportsRevenueChart;
        
        chart.getDescription().setEnabled(false);
        chart.setTouchEnabled(true);
        chart.setDragEnabled(true);
        chart.setScaleEnabled(true);
        chart.setPinchZoom(true);
        chart.setDrawGridBackground(false);
        
        XAxis xAxis = chart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setDrawGridLines(false);
        xAxis.setGranularity(1f);
        
        chart.getAxisLeft().setDrawGridLines(true);
        chart.getAxisRight().setEnabled(false);
    }

    private void updateChartData() {
        List<Entry> entries = new ArrayList<>();
        // Group by month (simplified for demo)
        // In a real app, use a proper map to aggregate amounts by month
        
        // Mock data for visualization if empty
        if (filteredPayments.isEmpty()) {
            entries.add(new Entry(0, 0));
            entries.add(new Entry(1, 1000));
            entries.add(new Entry(2, 2500));
            entries.add(new Entry(3, 1800));
        } else {
             // Real data aggregation logic would go here
             // For now, let's just plot cumulative collection
             float total = 0;
             int index = 0;
             for (Payment p : filteredPayments) {
                 total += p.getAmount();
                 entries.add(new Entry(index++, total));
             }
        }

        LineDataSet dataSet = new LineDataSet(entries, "Revenue Collection");
        dataSet.setColor(Color.BLUE);
        dataSet.setValueTextColor(Color.BLACK);
        dataSet.setLineWidth(2f);
        dataSet.setCircleRadius(4f);
        dataSet.setMode(LineDataSet.Mode.CUBIC_BEZIER);
        dataSet.setDrawFilled(true);
        dataSet.setFillColor(Color.BLUE);
        dataSet.setFillAlpha(50);

        LineData lineData = new LineData(dataSet);
        binding.reportsRevenueChart.setData(lineData);
        binding.reportsRevenueChart.invalidate(); // Refresh
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}

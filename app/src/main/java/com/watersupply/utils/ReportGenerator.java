package com.watersupply.utils;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.pdf.PdfDocument;
import android.os.Environment;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.widget.Toast;

import com.watersupply.data.models.Payment;
import com.watersupply.data.models.SupplyEntry;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;

public class ReportGenerator {

    private final Context context;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy", Locale.getDefault());
    private final SimpleDateFormat shortDateFormat = new SimpleDateFormat("dd MMM yyyy", Locale.getDefault());
    private final SimpleDateFormat fileDateFormat = new SimpleDateFormat("ddMMMyy", Locale.US);

    public ReportGenerator(Context context) {
        this.context = context;
    }

    public void generateReport(String format, String farmerName, String farmerId, Date startDate, Date endDate, 
                               List<SupplyEntry> supplies, List<Payment> payments, 
                               Map<String, String> farmerNameMap) {
        
        PdfDocument document = new PdfDocument();
        PdfDocument.PageInfo pageInfo = new PdfDocument.PageInfo.Builder(595, 842, 1).create(); // A4
        
        try {
            drawV1(document, pageInfo, farmerName, farmerId, startDate, endDate, supplies, payments, farmerNameMap);
            
            String safeName = farmerName.replaceAll("[^a-zA-Z0-9.-]", "_");
            String fileName = "Report_" + safeName + "_" + fileDateFormat.format(new Date()) + ".pdf";
            File file = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);
            document.writeTo(new FileOutputStream(file));
            
            Toast.makeText(context, "Report saved: " + fileName, Toast.LENGTH_LONG).show();
            
        } catch (IOException e) {
            e.printStackTrace();
            Toast.makeText(context, "Error saving report", Toast.LENGTH_SHORT).show();
        } finally {
            document.close();
        }
    }
    
    // ==========================================
    // VERSION 1: Original HTML Design Match
    // ==========================================
    private void drawV1(PdfDocument document, PdfDocument.PageInfo pageInfo, String farmerName, String farmerId,
                       Date startDate, Date endDate, List<SupplyEntry> supplies, List<Payment> payments,
                       Map<String, String> farmerNameMap) {
        
        PdfDocument.Page page = document.startPage(pageInfo);
        Canvas canvas = page.getCanvas();
        Paint paint = new Paint();
        TextPaint textPaint = new TextPaint();
        
        int width = pageInfo.getPageWidth(); // 595
        int height = pageInfo.getPageHeight(); // 842
        int margin = 40; 
        int y = 50;
        
        // --- Colors ---
        int colorPrimary = Color.parseColor("#0056b3");
        int colorRed = Color.parseColor("#d32f2f");
        int colorDarkGray = Color.parseColor("#333333");
        int colorLightGray = Color.parseColor("#666666");
        int colorBgMeta = Color.parseColor("#f8f9fa");
        int colorBorderCard = Color.parseColor("#e0e0e0");
        int colorGreenText = Color.parseColor("#2e7d32");
        int colorFooterBg = Color.parseColor("#eeeeee");
        
        // Badge Colors
        int badgeSupplyBg = Color.parseColor("#e3f2fd");
        int badgeSupplyText = Color.parseColor("#1565c0");
        int badgePaymentBg = Color.parseColor("#e8f5e9");
        int badgePaymentText = Color.parseColor("#2e7d32");
        
        // --- Header ---
        paint.setColor(colorPrimary);
        paint.setTextSize(18); // Reduced from 24
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("💧 Water Supply Manager", margin, y, paint);
        
        paint.setTextAlign(Paint.Align.RIGHT);
        paint.setColor(colorDarkGray);
        paint.setTextSize(20); // Reduced from 28
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL));
        paint.setLetterSpacing(0.05f);
        canvas.drawText("REPORT", width - margin, y, paint); 
        paint.setLetterSpacing(0);
        
        paint.setColor(colorLightGray);
        paint.setTextSize(10); // Reduced from 14
        paint.setTypeface(Typeface.DEFAULT);
        canvas.drawText("Generated: " + dateFormat.format(new Date()), width - margin, y + 15, paint);
        paint.setTextAlign(Paint.Align.LEFT);
        
        y += 30;
        paint.setColor(colorPrimary);
        paint.setStrokeWidth(1);
        canvas.drawLine(margin, y, width - margin, y, paint);
        
        // --- Meta Info ---
        y += 20;
        int metaH = 60; // Reduced height
        RectF metaRect = new RectF(margin, y, width - margin, y + metaH);
        paint.setColor(colorBgMeta);
        paint.setStyle(Paint.Style.FILL);
        canvas.drawRoundRect(metaRect, 6, 6, paint);
        
        paint.setColor(colorPrimary);
        canvas.drawRect(margin, y, margin + 4, y + metaH, paint);
        
        int col1X = margin + 20;
        int col2X = margin + 200;
        int col3X = margin + 380;
        
        int labelY = y + 20;
        int valueY = y + 40;
        
        paint.setColor(colorLightGray);
        paint.setTextSize(10);
        canvas.drawText("REPORT FOR", col1X, labelY, paint);
        canvas.drawText("PERIOD", col2X, labelY, paint);
        canvas.drawText("STATUS", col3X, labelY, paint);
        
        // Name
        textPaint.setColor(colorDarkGray);
        textPaint.setTextSize(12);
        textPaint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        
        String dispName = farmerName;
        if (dispName.length() > 25) dispName = dispName.substring(0, 22) + "...";
        canvas.drawText(dispName, col1X, valueY, textPaint);
        
        // Period
        canvas.drawText(shortDateFormat.format(startDate) + " - " + shortDateFormat.format(endDate), col2X, valueY, textPaint);
        
        // Status
        paint.setColor(colorRed);
        paint.setTextSize(12);
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        canvas.drawText("Pending Dues", col3X, valueY, paint); 
        
        y += 80;
        
        // --- Cards ---
        double totalHours = 0;
        double totalBilled = 0;
        for(SupplyEntry s : supplies) {
            totalHours += s.getTotalTimeUsed();
            totalBilled += s.getAmount();
        }
        
        double totalPaid = 0;
        for(Payment p : payments) totalPaid += p.getAmount();
        
        double pending = totalBilled - totalPaid;
        
        int gap = 15;
        int cardW = (width - (2*margin) - (2*gap)) / 3;
        int cardH = 60; // Reduced height
        
        drawCardV2(canvas, margin, y, cardW, cardH, "Total Supply", String.format("%.1f Hrs", totalHours), false, colorBorderCard, colorLightGray, colorDarkGray);
         // Count overlay
        paint.setColor(colorLightGray);
        paint.setTextSize(9);
        paint.setTextAlign(Paint.Align.CENTER);
        paint.setTypeface(Typeface.DEFAULT);
        canvas.drawText(supplies.size() + " Entries", margin + cardW/2f, y + 50, paint);
        
        drawCardV2(canvas, margin + cardW + gap, y, cardW, cardH, "Total Charges", "₹" + String.format(Locale.US, "%.0f", totalBilled), false, colorBorderCard, colorLightGray, colorDarkGray);
        
        drawCardV2(canvas, margin + 2*(cardW + gap), y, cardW, cardH, "Pending Due", "₹" + String.format(Locale.US, "%.0f", pending), true, Color.TRANSPARENT, Color.argb(255, 255, 255, 255), Color.WHITE);
        
        y += 80;
        
        // --- Table ---
        class ReportItem {
            long timestamp;
            String date;
            String details;
            String farmerName;
            double amount; 
            boolean isPayment;
        }
        
        boolean isAllFarmers = "All Farmers".equals(farmerName);
        
        List<ReportItem> items = new ArrayList<>();
        try {
            SimpleDateFormat pF = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
            for(SupplyEntry s : supplies) {
                ReportItem i = new ReportItem();
                Date d = pF.parse(s.getDate());
                i.timestamp = d != null ? d.getTime() : 0;
                i.date = shortDateFormat.format(d != null ? d : new Date());
                i.details = String.format(Locale.US, "%.1f Hrs @ ₹%.0f/hr", s.getTotalTimeUsed(), s.getRate());
                String fName = s.getFarmerName();
                if ((fName == null || fName.isEmpty()) && s.getFarmerId() != null && farmerNameMap != null) {
                    fName = farmerNameMap.get(s.getFarmerId());
                }
                i.farmerName = (fName != null && !fName.isEmpty()) ? fName : "Unknown";
                i.amount = s.getAmount();
                i.isPayment = false;
                items.add(i);
            }
            for(Payment p : payments) {
                ReportItem i = new ReportItem();
                Date d = pF.parse(p.getPaymentDate());
                i.timestamp = d != null ? d.getTime() : 0;
                i.date = shortDateFormat.format(d != null ? d : new Date());
                i.details = p.getPaymentMethod() != null ? p.getPaymentMethod() : "Payment";
                String fName = p.getFarmerName();
                if ((fName == null || fName.isEmpty()) && p.getFarmerId() != null && farmerNameMap != null) {
                    fName = farmerNameMap.get(p.getFarmerId());
                }
                i.farmerName = (fName != null && !fName.isEmpty()) ? fName : "Unknown";
                i.amount = p.getAmount();
                i.isPayment = true;
                items.add(i);
            }
            Collections.sort(items, (o1, o2) -> Long.compare(o1.timestamp, o2.timestamp));
        } catch(Exception e){}

        // Header
        int rowH = 30; // Reduced row height
        
        paint.setColor(colorPrimary);
        paint.setStyle(Paint.Style.FILL);
        canvas.drawRect(margin, y, width - margin, y + rowH, paint);
        
        paint.setColor(Color.WHITE);
        paint.setTextSize(11);
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD)); 
        
        // Layout Config
        int tY = y + 20;
        int c1 = margin + 10; // Date
        int c2 = isAllFarmers ? margin + 110 : 0; // Farmer (only if all)
        int c3 = isAllFarmers ? margin + 220 : margin + 130; // Type
        int c4 = isAllFarmers ? margin + 290 : margin + 210; // Details
        int c5 = width - margin - 10; // Amount (Right aligned)
        
        canvas.drawText("Date", c1, tY, paint);
        if (isAllFarmers) canvas.drawText("Farmer", c2, tY, paint);
        canvas.drawText("Type", c3, tY, paint);
        canvas.drawText("Details", c4, tY, paint);
        paint.setTextAlign(Paint.Align.RIGHT);
        canvas.drawText("Amount", c5, tY, paint);
        paint.setTextAlign(Paint.Align.LEFT);
        
        y += rowH;
        
        boolean isEven = false;
        paint.setTextSize(10);
        paint.setTypeface(Typeface.DEFAULT);
        
        for (ReportItem item : items) {
             if (y > height - 60) {
                 drawFooter(canvas, width, height, paint);
                 document.finishPage(page);
                 page = document.startPage(pageInfo);
                 canvas = page.getCanvas();
                 y = 50;
                 
                 // Re-Header
                 paint.setColor(colorPrimary);
                 paint.setStyle(Paint.Style.FILL);
                 canvas.drawRect(margin, y, width - margin, y + rowH, paint);
                 paint.setColor(Color.WHITE);
                 paint.setTextSize(11); // Header size
                 paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
                 
                 canvas.drawText("Date", c1, y + 20, paint);
                 if (isAllFarmers) canvas.drawText("Farmer", c2, y + 20, paint);
                 canvas.drawText("Type", c3, y + 20, paint);
                 canvas.drawText("Details", c4, y + 20, paint);
                 paint.setTextAlign(Paint.Align.RIGHT);
                 canvas.drawText("Amount", c5, y + 20, paint);
                 paint.setTextAlign(Paint.Align.LEFT);
                 y += rowH;
                 
                 paint.setTextSize(10); // Reset for rows
                 paint.setTypeface(Typeface.DEFAULT);
             }
             
             if (isEven) {
                 paint.setColor(colorBgMeta);
                 paint.setStyle(Paint.Style.FILL);
                 canvas.drawRect(margin, y, width - margin, y + rowH, paint);
             }
             
             paint.setColor(colorDarkGray);
             canvas.drawText(item.date, c1, y + 20, paint);
             
             if (isAllFarmers) {
                 String f = item.farmerName;
                 if (f != null && f.length() > 15) {
                     f = f.substring(0, 13) + "..";
                 } else if (f == null) {
                     f = "";
                 }
                 canvas.drawText(f, c2, y + 20, paint);
             }
             
             boolean paymentRow = item.isPayment;
             
             if (!paymentRow) drawBadge(canvas, "Supply", c3, y + 8, badgeSupplyBg, badgeSupplyText);
             else drawBadge(canvas, "Payment", c3, y + 8, badgePaymentBg, badgePaymentText);
             
             if (paymentRow) paint.setColor(colorGreenText);
             else paint.setColor(colorDarkGray);
             
             String det = item.details;
             int maxLen = isAllFarmers ? 25 : 40;
             if (det.length() > maxLen) det = det.substring(0, maxLen) + "..";
             canvas.drawText(det, c4, y + 20, paint);
             
             paint.setTextAlign(Paint.Align.RIGHT);
             paint.setTypeface(Typeface.create(Typeface.MONOSPACE, Typeface.NORMAL));
             
             if (paymentRow) canvas.drawText("-₹" + String.format(Locale.US, "%.2f", item.amount), c5, y + 20, paint);
             else canvas.drawText("₹" + String.format(Locale.US, "%.2f", item.amount), c5, y + 20, paint);
             
             paint.setTextAlign(Paint.Align.LEFT);
             paint.setTypeface(Typeface.DEFAULT);
             
             paint.setColor(Color.parseColor("#eeeeee"));
             paint.setStyle(Paint.Style.STROKE); 
             paint.setStrokeWidth(1);
             canvas.drawLine(margin, y + rowH, width - margin, y + rowH, paint);
             paint.setStyle(Paint.Style.FILL);
             
             y += rowH;
             isEven = !isEven;
        }
        
        // Final Footer Total
        y += 10;
        paint.setColor(colorFooterBg);
        paint.setStyle(Paint.Style.FILL);
        canvas.drawRect(margin, y, width - margin, y + 35, paint);
        
        paint.setColor(colorDarkGray); 
        paint.setTextSize(12);
        paint.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        paint.setTextAlign(Paint.Align.RIGHT);
        canvas.drawText("Total Outstanding Balance:", width - margin - 120, y + 22, paint); 
        
        paint.setColor(colorRed); 
        canvas.drawText("₹" + String.format(Locale.US, "%.2f", pending), width - margin - 10, y + 22, paint);
        
        drawFooter(canvas, width, height, paint);
        document.finishPage(page);
    }

    private void drawCardV2(Canvas canvas, int x, int y, int w, int h, String title, String val, boolean highlight, int borderColor, int titleColor, int valColor) {
        Paint p = new Paint();
        p.setColor(highlight ? Color.parseColor("#0056b3") : Color.WHITE);
        p.setStyle(Paint.Style.FILL);
        
        RectF cardRect = new RectF(x, y, x + w, y + h);
        canvas.drawRoundRect(cardRect, 6, 6, p); // Smaller radius
        
        if (!highlight) {
            Paint border = new Paint();
            border.setStyle(Paint.Style.STROKE);
            border.setColor(borderColor);
            border.setStrokeWidth(1);
            canvas.drawRoundRect(cardRect, 6, 6, border);
        }
        
        Paint textP = new Paint();
        textP.setColor(titleColor);
        textP.setTextSize(10); // Smaller title
        textP.setTextAlign(Paint.Align.CENTER);
        textP.setTypeface(Typeface.DEFAULT); 
        canvas.drawText(title.toUpperCase(), x + w/2f, y + 20, textP);
        
        textP.setTextSize(18); // Smaller value
        textP.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        textP.setColor(valColor);
        canvas.drawText(val, x + w/2f, y + 42, textP);
    }
    
    // Highlighted Card style
    private void drawCard(Canvas canvas, int x, int y, int w, int h, String title, String val, boolean highlight, int borderColor, int titleColor, int valColor) {
        Paint p = new Paint();
        p.setColor(highlight ? Color.parseColor("#0056b3") : Color.WHITE);
        p.setStyle(Paint.Style.FILL);
        
        RectF cardRect = new RectF(x, y, x + w, y + h);
        canvas.drawRoundRect(cardRect, 8, 8, p);
        
        if (!highlight) {
            Paint border = new Paint();
            border.setStyle(Paint.Style.STROKE);
            border.setColor(borderColor);
            border.setStrokeWidth(1);
            canvas.drawRoundRect(cardRect, 8, 8, border);
        }
        
        Paint textP = new Paint();
        textP.setColor(titleColor);
        textP.setTextSize(13);
        textP.setTextAlign(Paint.Align.CENTER);
        textP.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.NORMAL)); 
        canvas.drawText(title.toUpperCase(), x + w/2f, y + 25, textP);
        
        textP.setTextSize(24);
        textP.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        textP.setColor(valColor);
        canvas.drawText(val, x + w/2f, y + 55, textP);
    }
    
    private void drawBadge(Canvas canvas, String text, int x, int y, int bgColor, int textColor) {
        Paint p = new Paint();
        p.setColor(bgColor);
        p.setStyle(Paint.Style.FILL);
        
        Paint t = new Paint();
        t.setColor(textColor);
        t.setTextSize(11);
        t.setTypeface(Typeface.create(Typeface.DEFAULT, Typeface.BOLD));
        
        float textW = t.measureText(text);
        RectF r = new RectF(x, y, x + textW + 16, y + 20); 
        canvas.drawRoundRect(r, 4, 4, p);
        
        canvas.drawText(text, x + 8, y + 14, t);
    }
    
    private void drawFooter(Canvas canvas, int width, int height, Paint paint) {
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.parseColor("#999999"));
        paint.setTextSize(12);
        paint.setTypeface(Typeface.DEFAULT);
        paint.setTextAlign(Paint.Align.CENTER);
        canvas.drawText("Generated by Water Supply Management App • Developed by Aasav Chauhan", width / 2f, height - 35, paint);
    }
    
    public File getLastReportFile(String format, String farmerName) {
         // Return matching filename logic
         String safeName = farmerName.replaceAll("[^a-zA-Z0-9.-]", "_");
         String fileName = "Report_" + safeName + "_" + fileDateFormat.format(new Date()) + ".pdf";
         return new File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName);
    }
}

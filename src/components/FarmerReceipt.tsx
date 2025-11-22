import { useData } from '../context/DataContext';
import { Button } from './ui/button';
import { X, Printer } from 'lucide-react';

interface FarmerReceiptProps {
  farmerId: string;
  onClose: () => void;
  dateFrom?: string;
  dateTo?: string;
}

export function FarmerReceipt({ farmerId, onClose, dateFrom, dateTo }: FarmerReceiptProps) {
  const { farmers, supplyEntries, payments, settings } = useData();
  
  const farmer = farmers.find(f => f.id === farmerId);
  
  if (!farmer) return null;

  // Filter entries and payments for this farmer
  let farmerEntries = supplyEntries.filter(e => e.farmerId === farmerId);
  let farmerPayments = payments.filter(p => p.farmerId === farmerId);

  if (dateFrom) {
    farmerEntries = farmerEntries.filter(e => e.date >= dateFrom);
    farmerPayments = farmerPayments.filter(p => p.date >= dateFrom);
  }
  if (dateTo) {
    farmerEntries = farmerEntries.filter(e => e.date <= dateTo);
    farmerPayments = farmerPayments.filter(p => p.date <= dateTo);
  }

  // Calculate totals
  const totalHours = farmerEntries.reduce((sum, e) => sum + e.totalTimeUsed, 0);
  const totalCharges = farmerEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = farmerPayments.reduce((sum, p) => sum + p.amount, 0);
  const balance = totalCharges - totalPaid;

  // Combine and sort all transactions
  const allTransactions = [
    ...farmerEntries.map(e => ({ ...e, type: 'supply' as const })),
    ...farmerPayments.map(p => ({ ...p, type: 'payment' as const })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Modal Overlay - Hidden on print */}
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 print:hidden">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Farmer Account Statement</h2>
              <p className="text-sm text-blue-100 mt-1">{farmer.name}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="secondary" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm" className="text-white hover:bg-blue-800">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Modal Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="bg-white rounded-lg shadow-sm">
              {/* The actual receipt content that will be printed */}
              <div id="receipt-print-area" className="statement-document">
                {/* Header */}
                <div className="statement-header">
                  <div className="business-header">
                    <h1 className="business-title">{settings?.businessName || 'Water Irrigation Supply'}</h1>
                    {settings?.businessAddress && <p className="business-subtitle">{settings.businessAddress}</p>}
                    {settings?.contact && <p className="business-subtitle">Phone: {settings.contact}</p>}
                  </div>
                  <div className="document-type">
                    <div className="doc-badge">ACCOUNT STATEMENT</div>
                    <div className="doc-number">Statement #{new Date().getTime().toString().slice(-6)}</div>
                  </div>
                </div>

                <div className="horizontal-line"></div>

                {/* Farmer & Date Info */}
                <div className="info-grid">
                  <div className="info-box">
                    <h3 className="info-title">Account Holder</h3>
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{farmer.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Mobile:</span>
                      <span className="info-value">{farmer.mobile}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Location:</span>
                      <span className="info-value">{farmer.location}</span>
                    </div>
                  </div>

                  <div className="info-box">
                    <h3 className="info-title">Statement Period</h3>
                    <div className="info-row">
                      <span className="info-label">From:</span>
                      <span className="info-value">{dateFrom ? new Date(dateFrom).toLocaleDateString('en-IN') : 'Beginning'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">To:</span>
                      <span className="info-value">{dateTo ? new Date(dateTo).toLocaleDateString('en-IN') : 'Today'}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Generated:</span>
                      <span className="info-value">{new Date().toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="summary-section">
                  <h3 className="section-title">Account Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <div className="summary-label">Total Hours Used</div>
                      <div className="summary-value">{totalHours.toFixed(2)} hrs</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Total Charges</div>
                      <div className="summary-value text-red-600">₹{totalCharges.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="summary-item">
                      <div className="summary-label">Total Payments</div>
                      <div className="summary-value text-green-600">₹{totalPaid.toLocaleString('en-IN')}</div>
                    </div>
                    <div className={`summary-item balance-box ${balance > 0 ? 'balance-due' : balance < 0 ? 'balance-advance' : 'balance-clear'}`}>
                      <div className="summary-label">
                        {balance > 0 ? 'Amount Due' : balance < 0 ? 'Advance Balance' : 'Balance'}
                      </div>
                      <div className="balance-amount">
                        ₹{Math.abs(balance).toLocaleString('en-IN')}
                      </div>
                      {balance === 0 && <div className="balance-status">Fully Settled ✓</div>}
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="transactions-section">
                  <h3 className="section-title">Transaction History</h3>
                  <div className="table-container">
                    <table className="transactions-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Description</th>
                          <th className="text-right">Debit (₹)</th>
                          <th className="text-right">Credit (₹)</th>
                          <th className="text-right">Balance (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center empty-row">
                              No transactions found for the selected period
                            </td>
                          </tr>
                        ) : (
                          (() => {
                            let runningBalance = 0;
                            return allTransactions.map((transaction, index) => {
                              if (transaction.type === 'supply') {
                                runningBalance += transaction.amount;
                              } else {
                                runningBalance -= transaction.amount;
                              }
                              
                              return (
                                <tr key={`${transaction.type}-${transaction.id}`}>
                                  <td className="date-cell">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                                  <td>
                                    <span className={`type-badge ${transaction.type === 'supply' ? 'badge-debit' : 'badge-credit'}`}>
                                      {transaction.type === 'supply' ? 'Supply' : 'Payment'}
                                    </span>
                                  </td>
                                  <td className="desc-cell">
                                    {transaction.type === 'supply'
                                      ? `Water supply - ${transaction.totalTimeUsed.toFixed(2)} hours @ ₹${transaction.ratePerHour}/hr`
                                      : `Payment via ${transaction.mode}`}
                                  </td>
                                  <td className="debit-cell">{transaction.type === 'supply' ? `₹${transaction.amount.toLocaleString('en-IN')}` : '—'}</td>
                                  <td className="credit-cell">{transaction.type === 'payment' ? `₹${transaction.amount.toLocaleString('en-IN')}` : '—'}</td>
                                  <td className="balance-cell">₹{runningBalance.toLocaleString('en-IN')}</td>
                                </tr>
                              );
                            });
                          })()
                        )}
                        {allTransactions.length > 0 && (
                          <tr className="total-row">
                            <td colSpan={3}><strong>TOTAL</strong></td>
                            <td className="debit-cell"><strong>₹{totalCharges.toLocaleString('en-IN')}</strong></td>
                            <td className="credit-cell"><strong>₹{totalPaid.toLocaleString('en-IN')}</strong></td>
                            <td className="balance-cell"><strong>₹{balance.toLocaleString('en-IN')}</strong></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Rate Info */}
                <div className="rate-info">
                  <strong>Current Rate:</strong> ₹{settings?.ratePerHour || settings?.defaultHourlyRate || 100}/hour | <strong>Water Flow:</strong> {settings?.waterFlowRate || 1000} L/hour
                </div>

                {/* Payment Note */}
                {balance !== 0 && (
                  <div className={`payment-note ${balance > 0 ? 'note-due' : 'note-advance'}`}>
                    <div className="note-icon">{balance > 0 ? '⚠️' : 'ℹ️'}</div>
                    <div className="note-text">
                      {balance > 0 ? (
                        <>
                          <strong>Payment Due:</strong> Please clear the outstanding balance of <strong>₹{balance.toLocaleString('en-IN')}</strong> at your earliest convenience.
                        </>
                      ) : (
                        <>
                          <strong>Advance Payment:</strong> You have an advance balance of <strong>₹{Math.abs(balance).toLocaleString('en-IN')}</strong> which will be adjusted in future supplies.
                        </>
                      )}
                    </div>
                  </div>
                )}

                {balance === 0 && (
                  <div className="payment-note note-settled">
                    <div className="note-icon">✅</div>
                    <div className="note-text">
                      <strong>Account Settled:</strong> All payments are up to date. Thank you for your prompt payment!
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="statement-footer">
                  <div className="footer-left">
                    <p className="footer-date">Date: {new Date().toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="footer-right">
                    <div className="signature-box">
                      <div className="signature-line"></div>
                      <p className="signature-label">Authorized Signature</p>
                      <p className="signature-name">{settings?.businessName || 'Water Irrigation Supply'}</p>
                    </div>
                  </div>
                </div>

                <div className="footer-message">
                  <p className="thank-you">Thank you for your business!</p>
                  <p className="generated-text">This is a computer-generated statement. For queries, please contact us.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print View - Only shown when printing */}
      <div className="hidden print:block">
        <div className="statement-document">
          {/* Same content structure as above for printing */}
          <div className="statement-header">
            <div className="business-header">
              <h1 className="business-title">{settings?.businessName || 'Water Irrigation Supply'}</h1>
              {settings?.businessAddress && <p className="business-subtitle">{settings.businessAddress}</p>}
              {settings?.contact && <p className="business-subtitle">Phone: {settings.contact}</p>}
            </div>
            <div className="document-type">
              <div className="doc-badge">ACCOUNT STATEMENT</div>
              <div className="doc-number">Statement #{new Date().getTime().toString().slice(-6)}</div>
            </div>
          </div>

          <div className="horizontal-line"></div>

          <div className="info-grid">
            <div className="info-box">
              <h3 className="info-title">Account Holder</h3>
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{farmer.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Mobile:</span>
                <span className="info-value">{farmer.mobile}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">{farmer.location}</span>
              </div>
            </div>

            <div className="info-box">
              <h3 className="info-title">Statement Period</h3>
              <div className="info-row">
                <span className="info-label">From:</span>
                <span className="info-value">{dateFrom ? new Date(dateFrom).toLocaleDateString('en-IN') : 'Beginning'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">To:</span>
                <span className="info-value">{dateTo ? new Date(dateTo).toLocaleDateString('en-IN') : 'Today'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Generated:</span>
                <span className="info-value">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div className="summary-section">
            <h3 className="section-title">Account Summary</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <div className="summary-label">Total Hours Used</div>
                <div className="summary-value">{totalHours.toFixed(2)} hrs</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Total Charges</div>
                <div className="summary-value text-red-600">₹{totalCharges.toLocaleString('en-IN')}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">Total Payments</div>
                <div className="summary-value text-green-600">₹{totalPaid.toLocaleString('en-IN')}</div>
              </div>
              <div className={`summary-item balance-box ${balance > 0 ? 'balance-due' : balance < 0 ? 'balance-advance' : 'balance-clear'}`}>
                <div className="summary-label">
                  {balance > 0 ? 'Amount Due' : balance < 0 ? 'Advance Balance' : 'Balance'}
                </div>
                <div className="balance-amount">
                  ₹{Math.abs(balance).toLocaleString('en-IN')}
                </div>
                {balance === 0 && <div className="balance-status">Fully Settled ✓</div>}
              </div>
            </div>
          </div>

          <div className="transactions-section">
            <h3 className="section-title">Transaction History</h3>
            <div className="table-container">
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th className="text-right">Debit (₹)</th>
                    <th className="text-right">Credit (₹)</th>
                    <th className="text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center empty-row">
                        No transactions found for the selected period
                      </td>
                    </tr>
                  ) : (
                    (() => {
                      let runningBalance = 0;
                      return allTransactions.map((transaction, index) => {
                        if (transaction.type === 'supply') {
                          runningBalance += transaction.amount;
                        } else {
                          runningBalance -= transaction.amount;
                        }
                        
                        return (
                          <tr key={`${transaction.type}-${transaction.id}`}>
                            <td className="date-cell">{new Date(transaction.date).toLocaleDateString('en-IN')}</td>
                            <td>
                              <span className={`type-badge ${transaction.type === 'supply' ? 'badge-debit' : 'badge-credit'}`}>
                                {transaction.type === 'supply' ? 'Supply' : 'Payment'}
                              </span>
                            </td>
                            <td className="desc-cell">
                              {transaction.type === 'supply'
                                ? `Water supply - ${transaction.totalTimeUsed.toFixed(2)} hours @ ₹${transaction.ratePerHour}/hr`
                                : `Payment via ${transaction.mode}`}
                            </td>
                            <td className="debit-cell">{transaction.type === 'supply' ? `₹${transaction.amount.toLocaleString('en-IN')}` : '—'}</td>
                            <td className="credit-cell">{transaction.type === 'payment' ? `₹${transaction.amount.toLocaleString('en-IN')}` : '—'}</td>
                            <td className="balance-cell">₹{runningBalance.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      });
                    })()
                  )}
                  {allTransactions.length > 0 && (
                    <tr className="total-row">
                      <td colSpan={3}><strong>TOTAL</strong></td>
                      <td className="debit-cell"><strong>₹{totalCharges.toLocaleString('en-IN')}</strong></td>
                      <td className="credit-cell"><strong>₹{totalPaid.toLocaleString('en-IN')}</strong></td>
                      <td className="balance-cell"><strong>₹{balance.toLocaleString('en-IN')}</strong></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rate-info">
            <strong>Current Rate:</strong> ₹{settings?.ratePerHour || settings?.defaultHourlyRate || 100}/hour | <strong>Water Flow:</strong> {settings?.waterFlowRate || 1000} L/hour
          </div>

          {balance !== 0 && (
            <div className={`payment-note ${balance > 0 ? 'note-due' : 'note-advance'}`}>
              <div className="note-icon">{balance > 0 ? '⚠️' : 'ℹ️'}</div>
              <div className="note-text">
                {balance > 0 ? (
                  <>
                    <strong>Payment Due:</strong> Please clear the outstanding balance of <strong>₹{balance.toLocaleString('en-IN')}</strong> at your earliest convenience.
                  </>
                ) : (
                  <>
                    <strong>Advance Payment:</strong> You have an advance balance of <strong>₹{Math.abs(balance).toLocaleString('en-IN')}</strong> which will be adjusted in future supplies.
                  </>
                )}
              </div>
            </div>
          )}

          {balance === 0 && (
            <div className="payment-note note-settled">
              <div className="note-icon">✅</div>
              <div className="note-text">
                <strong>Account Settled:</strong> All payments are up to date. Thank you for your prompt payment!
              </div>
            </div>
          )}

          <div className="statement-footer">
            <div className="footer-left">
              <p className="footer-date">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
            <div className="footer-right">
              <div className="signature-box">
                <div className="signature-line"></div>
                <p className="signature-label">Authorized Signature</p>
                <p className="signature-name">{settings?.businessName || 'Water Irrigation Supply'}</p>
              </div>
            </div>
          </div>

          <div className="footer-message">
            <p className="thank-you">Thank you for your business!</p>
            <p className="generated-text">This is a computer-generated statement. For queries, please contact us.</p>
          </div>
        </div>
      </div>
    </>
  );
}

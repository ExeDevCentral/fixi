import React, { useState } from 'react';
import { CreditCard, ArrowRightLeft, Banknote, ShieldCheck, CheckCircle2, Lock, QrCode, Upload, Check } from 'lucide-react';
import { FixiOrder, PaymentPlatform } from '../../types/simulator.types';

interface PaymentGatewaySimulatorProps {
  order: FixiOrder;
  onPaymentSuccess: () => void;
}

export const PaymentGatewaySimulator: React.FC<PaymentGatewaySimulatorProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<PaymentPlatform>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState('MATIAS ROMERO');
  const [cardExp, setCardExp] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('412');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard'>('visa');

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1400);
  };

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(order.precioEstimado);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl obsidian-card p-6 sm:p-10 shadow-2xl space-y-6">
      {/* Header and Pricing summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Pasarela de Pagos Custodiada
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
            Liquidación de Servicio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {order.categoriaNombre} • {order.problemaSeleccionado}
          </p>
        </div>

        <div className="text-left sm:text-right bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08]">
          <div className="text-[11px] font-medium text-slate-400">Total a liquidar</div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight my-0.5">
            {formattedPrice}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end font-mono">
            <Lock className="w-3 h-3 text-emerald-400" /> PCI-DSS Nivel 1 • TLS 1.3
          </div>
        </div>
      </div>

      {/* Platform Switcher Tabs (Segmented Control) */}
      <div className="grid grid-cols-3 gap-2 p-1.5 glass-pill-container rounded-2xl">
        <button
          onClick={() => setMethod('CARD')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all text-xs ${
            method === 'CARD'
              ? 'bg-white text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Tarjeta</span>
        </button>

        <button
          onClick={() => setMethod('TRANSFER')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all text-xs ${
            method === 'TRANSFER'
              ? 'bg-white text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Transferencia / MODO</span>
        </button>

        <button
          onClick={() => setMethod('CASH')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all text-xs ${
            method === 'CASH'
              ? 'bg-white text-slate-950 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Efectivo con PIN</span>
        </button>
      </div>

      {/* Method 1: Credit / Debit Card Tab (Titanium Black Card Style) */}
      {method === 'CARD' && (
        <div className="space-y-6 pt-2">
          {/* Virtual Card Graphic */}
          <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl p-6 metal-black-card flex flex-col justify-between overflow-hidden">
            {/* Subtle light streak */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-transparent pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <span className="font-mono text-[10px] tracking-widest text-slate-400 font-semibold">
                FIXI PLATINUM TITANIUM
              </span>
              <span className="font-bold text-xs tracking-widest uppercase text-slate-300 font-mono">
                {cardBrand === 'visa' ? 'VISA' : 'MASTERCARD'}
              </span>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              {/* EMV Laser Chip */}
              <div className="w-9 h-7 rounded bg-gradient-to-tr from-amber-200 via-amber-400 to-amber-200 border border-amber-300/80 shadow flex items-center justify-center">
                <div className="w-5 h-3.5 border border-amber-700/40 rounded-sm" />
              </div>
              <div className="text-[9px] font-mono tracking-wider text-slate-400">EMV SECURE CHIP</div>
            </div>

            <div className="relative z-10 space-y-2">
              <div className="font-mono text-lg sm:text-xl tracking-[0.2em] text-white font-medium drop-shadow">
                {cardNumber}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-slate-500">Titular</div>
                  <div className="text-slate-200">{cardHolder}</div>
                </div>
                <div>
                  <div className="text-[8px] uppercase tracking-wider text-slate-500">Vence</div>
                  <div className="text-slate-200">{cardExp}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Número de Tarjeta</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  if (e.target.value.startsWith('5')) setCardBrand('mastercard');
                  else setCardBrand('visa');
                }}
                className="w-full bg-black/40 border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-white/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5">Vencimiento</label>
              <input
                type="text"
                value={cardExp}
                onChange={(e) => setCardExp(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-white/30 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] font-medium mb-1.5">CVV</label>
              <input
                type="password"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="w-full bg-black/40 border border-white/[0.09] rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-white/30 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Method 2: Transfer / MODO Tab */}
      {method === 'TRANSFER' && (
        <div className="space-y-4 pt-2">
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col sm:flex-row items-center gap-6">
            <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-24 h-24 text-slate-950" />
              <div className="text-[9px] font-bold text-slate-900 mt-1 uppercase tracking-wider font-mono">
                QR INTEROPERABLE
              </div>
            </div>

            <div className="flex-1 space-y-2.5 text-xs w-full">
              <div>
                <div className="text-slate-400 text-[11px]">Alias Bancario FIXI:</div>
                <div className="font-mono text-sm font-semibold text-emerald-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08] flex items-center justify-between">
                  <span>fixi.pagos.oficial</span>
                  <span className="text-[10px] text-slate-400 uppercase font-sans">Banco Galicia</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">CBU Oficial:</div>
                <div className="font-mono text-xs text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08]">
                  0070083230004018293012
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Titular: <span className="text-slate-200 font-medium">FIXI SERVICIOS DIGITALES S.A.S. • CUIT 30-71829384-9</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>
                {receiptUploaded ? (
                  <strong className="text-emerald-400">Comprobante validado: transaccion_ok.pdf</strong>
                ) : (
                  <span className="text-slate-300">¿Transferiste desde home banking o MODO?</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setReceiptUploaded(true)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] flex items-center gap-1.5 transition-all"
            >
              {receiptUploaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              {receiptUploaded ? 'Adjuntado' : 'Simular Comprobante'}
            </button>
          </div>
        </div>
      )}

      {/* Method 3: Cash Tab with PIN validation */}
      {method === 'CASH' && (
        <div className="p-6 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4 text-center">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-emerald-400 flex items-center justify-center mx-auto">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-white tracking-tight">Pago Presencial en Efectivo</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
              Aboná el importe exacto de <strong className="text-slate-200">{formattedPrice}</strong> una vez verificado el correcto funcionamiento del arreglo.
            </p>
          </div>

          <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.08] max-w-sm mx-auto">
            <div className="text-[11px] text-slate-400 mb-1">
              PIN de Validación de Conformidad:
            </div>
            <div className="font-mono text-2xl font-bold text-white tracking-widest bg-black/60 py-2 rounded-xl border border-white/[0.1]">
              {order.pinSeguridad}
            </div>
            <div className="text-[10px] text-slate-400 mt-2 font-mono">
              El profesional ingresa este código en su terminal FIXI-Pro para cerrar la orden.
            </div>
          </div>
        </div>
      )}

      {/* Action Submit Button (Apple / Stripe High Contrast) */}
      <div className="pt-6 border-t border-white/[0.08]">
        <button
          onClick={handleProcessPayment}
          disabled={isProcessing}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Confirmando transacción cifrada...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Abonar {formattedPrice} y Finalizar</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-3 font-mono">
          FIXI Escrow Protection • Cobertura total de 90 días ante fallas o disconformidad
        </p>
      </div>
    </div>
  );
};

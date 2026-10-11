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

  // Cash code state
  const [cashCodeEntered, setCashCodeEntered] = useState(order.pinSeguridad);

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 1500);
  };

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(order.precioEstimado);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl bg-slate-900/95 border border-slate-700/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Header and Pricing summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Pasarela de Pago Segura FIXI
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Aboná el Servicio Completado
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {order.categoriaNombre} • {order.problemaSeleccionado}
          </p>
        </div>

        <div className="text-left sm:text-right bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Total a abonar:</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formattedPrice}
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1 sm:justify-end mt-0.5">
            <Lock className="w-3 h-3 text-emerald-400" /> Cifrado bancario 256-bit
          </div>
        </div>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2.5 my-6">
        <button
          onClick={() => setMethod('CARD')}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center gap-2 ${
            method === 'CARD'
              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <CreditCard className={`w-5 h-5 ${method === 'CARD' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <div className="text-xs font-bold leading-tight">Tarjeta</div>
          <div className="text-[10px] text-slate-400 hidden sm:block">Crédito o Débito</div>
        </button>

        <button
          onClick={() => setMethod('TRANSFER')}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center gap-2 ${
            method === 'TRANSFER'
              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <ArrowRightLeft className={`w-5 h-5 ${method === 'TRANSFER' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <div className="text-xs font-bold leading-tight">Transferencia / MODO</div>
          <div className="text-[10px] text-slate-400 hidden sm:block">CBU / QR Interoperable</div>
        </button>

        <button
          onClick={() => setMethod('CASH')}
          className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border transition-all text-center gap-2 ${
            method === 'CASH'
              ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          <Banknote className={`w-5 h-5 ${method === 'CASH' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <div className="text-xs font-bold leading-tight">Efectivo</div>
          <div className="text-[10px] text-slate-400 hidden sm:block">Entrega contra PIN</div>
        </button>
      </div>

      {/* Method 1: Credit / Debit Card Tab */}
      {method === 'CARD' && (
        <div className="space-y-5">
          {/* Virtual Card Graphic */}
          <div className="relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-wider text-emerald-400 font-bold">FIXI SECURE PAY</span>
              <span className="font-bold text-sm tracking-widest uppercase text-white font-mono">
                {cardBrand === 'visa' ? 'VISA' : 'MASTERCARD'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300 shadow-inner flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-600/60 rounded-sm" />
              </div>
              <div className="text-[10px] font-mono text-emerald-300/80">CONTACTLESS NFC</div>
            </div>

            <div>
              <div className="font-mono text-lg sm:text-xl tracking-widest text-white font-bold drop-shadow">
                {cardNumber}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 mt-2 font-mono">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Titular</div>
                  <div>{cardHolder}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase">Vence</div>
                  <div>{cardExp}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="col-span-2">
              <label className="block text-slate-400 mb-1">Número de Tarjeta</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  if (e.target.value.startsWith('5')) setCardBrand('mastercard');
                  else setCardBrand('visa');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Vencimiento</label>
              <input
                type="text"
                value={cardExp}
                onChange={(e) => setCardExp(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">CVV</label>
              <input
                type="password"
                maxLength={4}
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Method 2: Transfer / MODO Tab */}
      {method === 'TRANSFER' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
            {/* Mockup QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center shrink-0">
              <QrCode className="w-28 h-28 text-slate-950" />
              <div className="text-[10px] font-bold text-slate-900 mt-1 uppercase tracking-wider font-mono">
                QR Interoperable BCRA
              </div>
            </div>

            <div className="flex-1 space-y-2.5 text-xs w-full">
              <div>
                <div className="text-slate-400 text-[11px]">Alias Bancario FIXI:</div>
                <div className="font-mono text-sm font-bold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span>fixi.pagos.oficial</span>
                  <span className="text-[10px] text-slate-400 uppercase">Banco Galicia</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">CBU Oficial:</div>
                <div className="font-mono text-xs text-slate-200 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                  0070083230004018293012
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-[11px]">Titular de la cuenta:</div>
                <div className="text-slate-200 font-medium">FIXI SERVICIOS DIGITALES S.A.S. • CUIT 30-71829384-9</div>
              </div>
            </div>
          </div>

          {/* Upload simulated proof */}
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>
                {receiptUploaded ? (
                  <strong className="text-emerald-400">Comprobante adjuntado: recibo_transferencia.pdf</strong>
                ) : (
                  <span className="text-slate-300">¿Hiciste la transferencia desde tu app bancaria o MODO?</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setReceiptUploaded(true)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              {receiptUploaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
              {receiptUploaded ? 'Adjunto OK' : 'Simular Adjunto'}
            </button>
          </div>
        </div>
      )}

      {/* Method 3: Cash Tab with PIN validation */}
      {method === 'CASH' && (
        <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">Pago en Efectivo Mano a Mano</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Entrégale al profesional el importe en efectivo de <strong>{formattedPrice}</strong> únicamente luego de comprobar que el trabajo quedó solucionado a tu satisfacción.
            </p>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 max-w-sm mx-auto">
            <div className="text-[11px] text-slate-400 mb-1">
              Validá con el profesional el PIN de cobro:
            </div>
            <div className="font-mono text-2xl font-black text-amber-400 tracking-widest bg-slate-950 py-2 rounded-xl border border-amber-500/30">
              {cashCodeEntered}
            </div>
            <div className="text-[10px] text-slate-400 mt-2">
              Al confirmar, el profesional ingresa este código en su app FIXI-Pro para cerrar la orden.
            </div>
          </div>
        </div>
      )}

      {/* Action Submit Button */}
      <div className="mt-8 pt-6 border-t border-slate-800">
        <button
          onClick={handleProcessPayment}
          disabled={isProcessing}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Procesando pago seguro en FIXI...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirmar Pago de {formattedPrice} y Calificar</span>
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-400 mt-3">
          Transacción simulada protegida por Garantía FIXI • Reintegro garantizado si el trabajo presenta fallas dentro de los 90 días.
        </p>
      </div>
    </div>
  );
};

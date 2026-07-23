import React, { useState } from 'react';
import { X, User, Star, HelpCircle, LogOut, Clock, PlusCircle, ShieldCheck, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { UserProfile, TicketSoporte, Proveedor, Mensaje } from '../types/database.types';

interface ClientDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onLogout: () => void;
  tickets: TicketSoporte[];
  messages?: Mensaje[];
  onSendMessage?: (receptorEmail: string, contenido: string, proveedorId?: string) => Promise<void>;
  onOpenCreateTicket: () => void;
  onOpenRating: (provider: Proveedor) => void;
  contactedProviders: Proveedor[];
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  tickets,
  messages = [],
  onSendMessage,
  onOpenCreateTicket,
  onOpenRating,
  contactedProviders,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'messages' | 'tickets'>('history');
  const [replyContent, setReplyContent] = useState('');
  const [selectedContactEmail, setSelectedContactEmail] = useState<string | null>(null);
  const [sendingReply, setSendingReply] = useState(false);

  if (!isOpen || !user) return null;

  // Filter messages belonging to current user
  const userMessages = messages.filter(
    (m) => m.emisor_email === user.email || m.receptor_email === user.email
  );

  // Group messages by counterpart email
  const contactsMap = new Map<string, { email: string; lastMessage: Mensaje; messages: Mensaje[] }>();
  
  userMessages.forEach((m) => {
    const counterpart = m.emisor_email === user.email ? m.receptor_email : m.emisor_email;
    if (!contactsMap.has(counterpart)) {
      contactsMap.set(counterpart, { email: counterpart, lastMessage: m, messages: [m] });
    } else {
      const entry = contactsMap.get(counterpart)!;
      entry.messages.push(m);
      if (new Date(m.created_at) > new Date(entry.lastMessage.created_at)) {
        entry.lastMessage = m;
      }
    }
  });

  const contactsList = Array.from(contactsMap.values());
  const activeContactEmail = selectedContactEmail || (contactsList.length > 0 ? contactsList[0].email : null);
  const activeThread = activeContactEmail ? contactsMap.get(activeContactEmail)?.messages || [] : [];

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeContactEmail || !onSendMessage) return;

    setSendingReply(true);
    try {
      await onSendMessage(activeContactEmail, replyContent.trim());
      setReplyContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl relative bg-[#0f172a] text-white max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.foto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt={user.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {user.nombre}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Usuario Fixi
                </span>
              </h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 my-6 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Historial</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'messages'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensajes ({userMessages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'tickets'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Soporte ({tickets.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Servicios Contactados Recientemente
              </h4>
            </div>

            {contactedProviders.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
                <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                Aún no has contactado profesionales en esta sesión.
              </div>
            ) : (
              <div className="space-y-3">
                {contactedProviders.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.foto_url}
                        alt={p.nombre}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="text-sm font-bold text-white">{p.nombre}</p>
                        <p className="text-xs text-slate-400">{p.categoria?.nombre} • {p.zona?.nombre}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenRating(p)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Calificar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Chat Directo entre Usuarios y Prestadores
            </h4>

            {contactsList.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs bg-slate-900/40 rounded-2xl p-6 border border-slate-800 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="font-semibold text-slate-300">No tenés conversaciones activas todavía.</p>
                <p className="text-slate-500">Buscá un servicio en Fixi y usá la opción "Mensaje Interno".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[320px]">
                {/* Contacts sidebar */}
                <div className="space-y-2 border-r border-slate-800 pr-2">
                  {contactsList.map((contact) => (
                    <button
                      key={contact.email}
                      onClick={() => setSelectedContactEmail(contact.email)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        activeContactEmail === contact.email
                          ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <p className="text-xs font-bold truncate">{contact.email}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {contact.lastMessage.contenido}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Active Chat Thread */}
                <div className="md:col-span-2 flex flex-col justify-between space-y-3">
                  <div className="space-y-2 max-h-[240px] overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800">
                    {activeThread.map((msg) => {
                      const isMe = msg.emisor_email === user.email;
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                                : 'bg-slate-800 text-white border border-slate-700 rounded-tl-none'
                            }`}
                          >
                            {msg.contenido}
                          </div>
                          <span className="text-[9px] text-slate-500 mt-1 px-1">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Send Reply Form */}
                  <form onSubmit={handleSendReply} className="flex gap-2">
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escribí una respuesta..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyContent.trim()}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tus Tickets de Soporte
              </h4>
              <button
                onClick={onOpenCreateTicket}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Nuevo Ticket</span>
              </button>
            </div>

            {tickets.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-slate-900/40 rounded-2xl p-6 border border-slate-800">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                No tenés tickets de soporte abiertos.
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">{t.categoria}</span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {t.estado}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white">{t.asunto}</p>
                    <p className="text-xs text-slate-300">{t.mensaje}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};


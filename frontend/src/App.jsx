import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/tickets";
const statuses = ["Aberto", "Em andamento", "Resolvido", "Fechado"];
const priorities = ["Baixa", "Média", "Alta", "Urgente"];

function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: [] });
  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });
  const [form, setForm] = useState({ title: "", description: "", requester: "", category: "Outros", priority: "Média" });
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const query = new URLSearchParams(Object.entries(filters).filter(([,v]) => v));
    const [ticketsRes, statsRes] = await Promise.all([fetch(API + "?" + query), fetch(API + "/stats")]);
    setTickets(await ticketsRes.json());
    setStats(await statsRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [filters.status, filters.priority]);

  async function createTicket(e) {
    e.preventDefault();
    if (!form.title || !form.description || !form.requester) return;
    await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", description: "", requester: "", category: "Outros", priority: "Média" });
    load();
  }

  async function updateStatus(id, status) {
    await fetch(`${API}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  async function removeTicket(id) {
    if (!confirm("Excluir este chamado?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <main className="container">
      <header>
        <div>
          <p className="eyebrow">PORTFÓLIO • SISTEMA DE TI</p>
          <h1>Help Desk</h1>
          <p className="subtitle">Central de chamados para acompanhar solicitações de suporte.</p>
        </div>
        <div className="total"><strong>{stats.total}</strong><span>chamados</span></div>
      </header>

      <section className="cards">
        {statuses.map(status => (
          <div className="card" key={status}>
            <span>{status}</span>
            <strong>{stats.byStatus.find(x => x.status === status)?.total || 0}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Novo chamado</h2>
        <form onSubmit={createTicket} className="form">
          <input placeholder="Título" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input placeholder="Solicitante" value={form.requester} onChange={e=>setForm({...form,requester:e.target.value})}/>
          <input placeholder="Categoria" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/>
          <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>{priorities.map(p=><option key={p}>{p}</option>)}</select>
          <textarea placeholder="Descrição do problema" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <button type="submit">Abrir chamado</button>
        </form>
      </section>

      <section className="panel">
        <div className="toolbar">
          <h2>Chamados</h2>
          <input placeholder="Buscar..." value={filters.search} onChange={e=>setFilters({...filters,search:e.target.value})} onKeyDown={e=>e.key==="Enter"&&load()}/>
          <select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}><option value="">Todos os status</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
          <select value={filters.priority} onChange={e=>setFilters({...filters,priority:e.target.value})}><option value="">Todas prioridades</option>{priorities.map(p=><option key={p}>{p}</option>)}</select>
          <button className="secondary" onClick={load}>Atualizar</button>
        </div>
        {loading ? <p>Carregando...</p> : tickets.length === 0 ? <p>Nenhum chamado encontrado.</p> : (
          <div className="tickets">
            {tickets.map(ticket => (
              <article className="ticket" key={ticket.id}>
                <div className="ticket-main">
                  <div className="ticket-top"><span>#{ticket.id}</span><b>{ticket.priority}</b></div>
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                  <small>{ticket.requester} • {ticket.category}</small>
                </div>
                <div className="ticket-actions">
                  <select value={ticket.status} onChange={e=>updateStatus(ticket.id,e.target.value)}>
                    {statuses.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button className="danger" onClick={()=>removeTicket(ticket.id)}>Excluir</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>Projeto de portfólio • Luis Fillipe Backer Faria</footer>
    </main>
  );
}

export default App;

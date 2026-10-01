const { all, get, run } = require("../database");

const validStatuses = ["Aberto", "Em andamento", "Resolvido", "Fechado"];
const validPriorities = ["Baixa", "Média", "Alta", "Urgente"];

async function listTickets(req, res) {
  try {
    const { status, priority, search } = req.query;
    const conditions = [];
    const params = [];

    if (status) { conditions.push("status = ?"); params.push(status); }
    if (priority) { conditions.push("priority = ?"); params.push(priority); }
    if (search) {
      conditions.push("(title LIKE ? OR description LIKE ? OR requester LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
    const tickets = await all(`SELECT * FROM tickets ${where} ORDER BY datetime(created_at) DESC`, params);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar chamados." });
  }
}

async function getTicket(req, res) {
  try {
    const ticket = await get("SELECT * FROM tickets WHERE id = ?", [req.params.id]);
    if (!ticket) return res.status(404).json({ error: "Chamado não encontrado." });
    res.json(ticket);
  } catch {
    res.status(500).json({ error: "Erro ao buscar chamado." });
  }
}

async function createTicket(req, res) {
  try {
    const { title, description, requester, category = "Outros", priority = "Média" } = req.body;
    if (!title || !description || !requester) {
      return res.status(400).json({ error: "Título, descrição e solicitante são obrigatórios." });
    }
    if (!validPriorities.includes(priority)) return res.status(400).json({ error: "Prioridade inválida." });

    const result = await run(
      "INSERT INTO tickets (title, description, requester, category, priority) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), description.trim(), requester.trim(), category, priority]
    );
    const ticket = await get("SELECT * FROM tickets WHERE id = ?", [result.id]);
    res.status(201).json(ticket);
  } catch {
    res.status(500).json({ error: "Erro ao criar chamado." });
  }
}

async function updateTicket(req, res) {
  try {
    const current = await get("SELECT * FROM tickets WHERE id = ?", [req.params.id]);
    if (!current) return res.status(404).json({ error: "Chamado não encontrado." });

    const title = req.body.title ?? current.title;
    const description = req.body.description ?? current.description;
    const requester = req.body.requester ?? current.requester;
    const category = req.body.category ?? current.category;
    const priority = req.body.priority ?? current.priority;
    const status = req.body.status ?? current.status;

    if (!validStatuses.includes(status) || !validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Status ou prioridade inválidos." });
    }

    await run(
      `UPDATE tickets
       SET title=?, description=?, requester=?, category=?, priority=?, status=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`,
      [title, description, requester, category, priority, status, req.params.id]
    );
    res.json(await get("SELECT * FROM tickets WHERE id = ?", [req.params.id]));
  } catch {
    res.status(500).json({ error: "Erro ao atualizar chamado." });
  }
}

async function deleteTicket(req, res) {
  try {
    const result = await run("DELETE FROM tickets WHERE id = ?", [req.params.id]);
    if (!result.changes) return res.status(404).json({ error: "Chamado não encontrado." });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erro ao excluir chamado." });
  }
}

async function stats(req, res) {
  try {
    const rows = await all("SELECT status, COUNT(*) AS total FROM tickets GROUP BY status");
    const priorityRows = await all("SELECT priority, COUNT(*) AS total FROM tickets GROUP BY priority");
    const total = await get("SELECT COUNT(*) AS total FROM tickets");
    res.json({ total: total.total, byStatus: rows, byPriority: priorityRows });
  } catch {
    res.status(500).json({ error: "Erro ao carregar indicadores." });
  }
}

module.exports = { listTickets, getTicket, createTicket, updateTicket, deleteTicket, stats };

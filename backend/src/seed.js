const { run } = require("./database");

async function seed() {
  await run("DELETE FROM tickets");
  const examples = [
    ["Computador não liga", "O equipamento não apresenta sinal ao pressionar o botão de energia.", "Ana Souza", "Hardware", "Urgente"],
    ["Acesso ao sistema", "Solicitante não consegue entrar no sistema interno.", "Carlos Lima", "Acesso", "Alta"],
    ["Instalação de software", "Necessário instalar uma ferramenta de trabalho.", "Marina Costa", "Software", "Média"],
    ["Dúvida sobre impressora", "Impressora aparece offline na estação.", "João Pedro", "Periféricos", "Baixa"]
  ];
  for (const item of examples) {
    await run(
      "INSERT INTO tickets (title, description, requester, category, priority) VALUES (?, ?, ?, ?, ?)",
      item
    );
  }
  console.log("Dados de exemplo inseridos.");
  process.exit(0);
}
seed();

/**
 * Recebe o formulário de contato (assets/js/form.js) e adiciona uma linha na
 * Google Sheet configurada via variáveis de ambiente.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });

const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

const SITUACOES_VALIDAS = [
  'habite-se',
  'inventario',
  'sem-escritura',
  'averbacao',
  'outro'
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  var body = req.body || {};

  // Honeypot: bots preenchem este campo, usuários reais nunca o veem.
  // Responde como se tivesse dado certo, sem gravar nada.
  if (typeof body.site === 'string' && body.site.trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  var lead = sanitize(body);
  var error = validate(lead);

  if (error) {
    return res.status(400).json({ error: error });
  }

  try {
    var doc = await openSheet();
    var sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
      Timestamp: new Date().toISOString(),
      Nome: lead.nome,
      Telefone: lead.telefone,
      Email: lead.email,
      Cidade: lead.cidade,
      'Situação': lead.situacao,
      Mensagem: lead.mensagem
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[api/leads] Falha ao gravar na planilha:', err);
    return res.status(500).json({ error: 'Erro ao registrar. Tente novamente.' });
  }
};

function sanitize(body) {
  return {
    nome: trim(body.nome).slice(0, 200),
    telefone: trim(body.telefone).slice(0, 40),
    email: trim(body.email).slice(0, 200),
    cidade: trim(body.cidade).slice(0, 200),
    situacao: trim(body.situacao),
    mensagem: trim(body.mensagem).slice(0, 4000)
  };
}

function trim(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function validate(lead) {
  if (!lead.nome) return 'Informe o nome completo.';
  if (!lead.telefone) return 'Informe um telefone.';
  if (!lead.email || !EMAIL_REGEX.test(lead.email)) return 'Informe um e-mail válido.';
  if (!lead.situacao || SITUACOES_VALIDAS.indexOf(lead.situacao) === -1) {
    return 'Selecione a situação do imóvel.';
  }
  return null;
}

function openSheet() {
  var missing = ['GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY', 'GOOGLE_SHEET_ID'].filter(
    function (name) {
      return !process.env[name];
    }
  );

  if (missing.length > 0) {
    throw new Error('Variável(is) de ambiente ausente(s): ' + missing.join(', '));
  }

  var jwt = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  var doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, jwt);
  return doc.loadInfo().then(function () {
    return doc;
  });
}

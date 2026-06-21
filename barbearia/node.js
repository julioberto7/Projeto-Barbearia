// ============================================
//  SALÃO BELLA DONNA — script.js
//  Funcionalidades:
//  1. Menu hambúrguer (mobile)
//  2. Header com sombra no scroll
//  3. Validação do formulário de agendamento
//  4. Envio para WhatsApp
// ============================================

// ─── 1. MENU HAMBÚRGUER ───
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('aberto');
});

// Fecha o menu ao clicar em qualquer link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('aberto');
  });
});

// ─── 2. HEADER COM SOMBRA NO SCROLL ───
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ─── 3. VALIDAÇÃO DO FORMULÁRIO ───
const form = document.getElementById('agendar-form');

// Função que valida um campo e mostra/esconde a mensagem de erro
function validarCampo(campo, mensagem) {
  const erro = document.getElementById('erro-' + campo.id);
  if (!campo.value.trim()) {
    campo.classList.add('erro');
    if (erro) erro.textContent = mensagem;
    return false;
  } else {
    campo.classList.remove('erro');
    if (erro) erro.textContent = '';
    return true;
  }
}

// Validação do telefone (precisa ter pelo menos 10 dígitos)
function validarTelefone(campo) {
  const erro = document.getElementById('erro-telefone');
  const numeros = campo.value.replace(/\D/g, ''); // remove tudo que não for número
  if (numeros.length < 10) {
    campo.classList.add('erro');
    if (erro) erro.textContent = 'Digite um WhatsApp válido com DDD.';
    return false;
  } else {
    campo.classList.remove('erro');
    if (erro) erro.textContent = '';
    return true;
  }
}

// Validação da data (não pode ser no passado)
function validarData(campo) {
  const erro = document.getElementById('erro-data');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataSelecionada = new Date(campo.value + 'T00:00:00');

  if (!campo.value) {
    campo.classList.add('erro');
    if (erro) erro.textContent = 'Selecione uma data.';
    return false;
  }
  if (dataSelecionada < hoje) {
    campo.classList.add('erro');
    if (erro) erro.textContent = 'Escolha uma data a partir de hoje.';
    return false;
  }
  campo.classList.remove('erro');
  if (erro) erro.textContent = '';
  return true;
}

// ─── 4. ENVIO PARA WHATSAPP ───
form.addEventListener('submit', (e) => {
  e.preventDefault(); // impede o envio padrão do formulário

  // Pega os valores de cada campo
  const nome     = document.getElementById('nome');
  const telefone = document.getElementById('telefone');
  const servico  = document.getElementById('servico');
  const data     = document.getElementById('data');
  const mensagem = document.getElementById('mensagem');

  // Valida todos os campos
  const nomeOk     = validarCampo(nome,     'Digite seu nome.');
  const telefoneOk = validarTelefone(telefone);
  const servicoOk  = validarCampo(servico,  'Selecione um serviço.');
  const dataOk     = validarData(data);

  // Se algum campo inválido, para aqui
  if (!nomeOk || !telefoneOk || !servicoOk || !dataOk) return;

  // Formata a data para exibir de forma amigável (ex: 25/12/2025)
  const dataFormatada = new Date(data.value + 'T00:00:00')
    .toLocaleDateString('pt-BR');

  // Monta a mensagem que será enviada no WhatsApp
  const obs = mensagem.value.trim()
    ? `\n📝 Observação: ${mensagem.value.trim()}`
    : '';

  const texto = `Olá! Olá! Vim pelo site e gostaria de agendar um horário:\n\n` +
    `👤 Nome: ${nome.value.trim()}\n` +
    `💇 Serviço: ${servico.value}\n` +
    `📅 Data preferida: ${dataFormatada}\n` +
    `📱 WhatsApp: ${telefone.value.trim()}` +
    obs;

  // Número do WhatsApp do salão — TROQUE PELO NÚMERO REAL
  const numeroSalao = '5584999999999';

  // Abre o WhatsApp com a mensagem preenchida
  const url = `https://wa.me/${numeroSalao}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
});

// ─── BÔNUS: define a data mínima do campo como hoje ───
const campoData = document.getElementById('data');
if (campoData) {
  const hoje = new Date().toISOString().split('T')[0];
  campoData.setAttribute('min', hoje);
}
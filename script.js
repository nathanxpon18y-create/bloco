document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    carregarBlocoNotas();

    // Evento de envio do formulário via classe
    const form = document.querySelector('.formulario');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            salvarAtendimento();
        });
    }

    // Salva o bloco de notas automaticamente ao digitar
    const blocoNotas = document.getElementById('blocoNotas');
    if (blocoNotas) {
        blocoNotas.addEventListener('input', () => {
            localStorage.setItem('blocoNotasTexto', blocoNotas.innerHTML);
        });
    }
});

function salvarAtendimento() {
    const cliente = document.getElementById('cliente').value.trim();
    const contrato = document.getElementById('contrato').value.trim();
    const tipo = document.getElementById('tipo').value;
    const status = document.getElementById('status').value;
    const obs = document.getElementById('obs').value.trim();

    if (!cliente || !contrato) {
        alert('Por favor, preencha o nome do cliente e o contrato.');
        return;
    }

    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    
    const form = document.querySelector('.formulario');
    const editIndex = form.dataset.editIndex;

    const novoAtendimento = { cliente, contrato, tipo, status, obs };

    if (editIndex !== undefined && editIndex !== '') {
        atendimentos[editIndex] = novoAtendimento;
        delete form.dataset.editIndex;
        form.querySelector('button[type="submit"]').innerText = 'Salvar Atendimento';
    } else {
        atendimentos.push(novoAtendimento);
    }

    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    
    form.reset();
    carregarDados();
}

function carregarDados() {
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    const lista = document.getElementById('listaAtendimentos');
    lista.innerHTML = '';

    let total = atendimentos.length;
    let cancelados = atendimentos.filter(a => a.tipo === 'Cancelado').length;
    let taxa = total > 0 ? ((cancelados / total) * 100).toFixed(2) : 0;

    document.getElementById('totalAtendimentos').innerText = total;
    document.getElementById('totalCancelamentos').innerText = cancelados;
    document.getElementById('taxaCancelamento').innerText = taxa + '%';

    if (total === 0) {
        lista.innerHTML = `<div class="sem-registros">Nenhum atendimento registrado ainda.</div>`;
        return;
    }

    const classesTipo = {
        'Venda': 'tipo-venda',
        'Suporte': 'tipo-suporte',
        'Retido': 'tipo-retido',
        'Cancelado': 'tipo-cancelado',
        'Transferida': 'tipo-transferida',
        'Combo Multi': 'tipo-venda',
        'Informações': 'tipo-suporte'
    };

    atendimentos.forEach((a, index) => {
        const classeBorda = classesTipo[a.tipo] || 'tipo-venda';

        lista.innerHTML += `
            <div class="registro-bloco ${classeBorda}">
                <div class="linha-completa atendimento-numero">Atendimento #${index + 1}</div>
                <div><strong>Cliente:</strong> <span>${a.cliente}</span></div>
                <div><strong>Contrato:</strong> <span>${a.contrato}</span></div>
                <div><strong>Tipo:</strong> <span>${a.tipo}</span></div>
                <div><strong>Status:</strong> <span>${a.status}</span></div>
                ${a.obs ? `<div class="linha-completa"><strong>Obs:</strong> <span>${a.obs}</span></div>` : ''}
                <div class="botao-acao">
                    <button class="editar" type="button" onclick="editarAtendimento(${index})">Editar</button>
                    <button class="apagar" type="button" onclick="apagarAtendimento(${index})">Apagar</button>
                </div>
            </div>
        `;
    });
}

function apagarAtendimento(index) {
    if (confirm('Deseja realmente apagar este atendimento?')) {
        let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
        atendimentos.splice(index, 1);
        localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
        carregarDados();
    }
}

function editarAtendimento(index) {
    let atendimentos = JSON.parse(localStorage.getItem('atendimentos')) || [];
    const a = atendimentos[index];

    document.getElementById('cliente').value = a.cliente;
    document.getElementById('contrato').value = a.contrato;
    document.getElementById('tipo').value = a.tipo;
    document.getElementById('status').value = a.status;
    document.getElementById('obs').value = a.obs || '';

    const form = document.querySelector('.formulario');
    form.dataset.editIndex = index;
    form.querySelector('button[type="submit"]').innerText = 'Atualizar Atendimento';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function carregarBlocoNotas() {
    const blocoNotas = document.getElementById('blocoNotas');
    const textoSalvo = localStorage.getItem('blocoNotasTexto');
    if (blocoNotas && textoSalvo) {
        blocoNotas.innerHTML = textoSalvo;
    }
}

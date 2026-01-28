// Variáveis globais para estatísticas
let totalAtendimentos = 0;
let totalCancelamentos = 0;

function atualizarEstatisticas() {
    document.getElementById('totalAtendimentos').textContent = totalAtendimentos;
    document.getElementById('totalCancelamentos').textContent = totalCancelamentos;
    const taxa = totalAtendimentos > 0 ? ((totalCancelamentos / totalAtendimentos) * 100).toFixed(2) : 0;
    document.getElementById('taxaCancelamento').textContent = `${taxa}%`;
}

function salvarAtendimento(editando = false, notaEdit = null) {
    const agora = new Date();
    const dataAtual = agora.toISOString().split('T')[0];
    const horaAtual = agora.toTimeString().split(' ')[0].slice(0,5);

    const cliente = document.getElementById('cliente').value;
    const contrato = document.getElementById('contrato').value;
    const tipo = document.getElementById('tipo').value;
    const status = document.getElementById('status').value;
    const obs = document.getElementById('obs').value;

    if (!cliente || !contrato) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    const data = dataAtual;
    const horario = horaAtual;

    const blocoNotas = document.getElementById('blocoNotas');
    let nota = notaEdit;

    // Se não estiver editando, cria nova nota
    if (!editando) {
        nota = document.createElement('div');
        nota.classList.add('registro-bloco');

        // Botões de ação
        const botoes = document.createElement('div');
        botoes.classList.add('botao-acao');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.classList.add('editar');
        btnEditar.onclick = () => {
            document.getElementById('cliente').value = cliente;
            document.getElementById('contrato').value = contrato;
            document.getElementById('tipo').value = tipo;
            document.getElementById('status').value = status;
            document.getElementById('obs').value = obs;

            // Ajusta estatísticas ao remover a nota
            totalAtendimentos--;
            if (tipo.toLowerCase() === 'cancelado') totalCancelamentos--;
            atualizarEstatisticas();

            blocoNotas.removeChild(nota);
        };

        const btnApagar = document.createElement('button');
        btnApagar.textContent = 'Apagar';
        btnApagar.classList.add('apagar');
        btnApagar.onclick = () => {
            totalAtendimentos--;
            if (tipo.toLowerCase() === 'cancelado') totalCancelamentos--;
            atualizarEstatisticas();
            blocoNotas.removeChild(nota);
        };

        botoes.appendChild(btnEditar);
        botoes.appendChild(btnApagar);
        nota.appendChild(botoes);

        blocoNotas.appendChild(nota);
    }

    // Adiciona cor por tipo
    switch (tipo.toLowerCase()) {
        case 'retido': nota.classList.add('tipo-retido'); break;
        case 'cancelado': nota.classList.add('tipo-cancelado'); break;
        case 'suporte': nota.classList.add('tipo-suporte'); break;
        case 'venda': nota.classList.add('tipo-venda'); break;
    }

    // Conteúdo do registro
    nota.innerHTML = `
        <span><strong>Cliente:</strong> ${cliente}</span>
        <span><strong>Contrato:</strong> ${contrato}</span>
        <span><strong>Data/Horário:</strong> ${data} ${horario}</span>
        <span><strong>Tipo:</strong> ${tipo}</span>
        <span><strong>Status:</strong> ${status}</span>
        <span><strong>Obs:</strong> ${obs}</span>
    `;

    // Re-adiciona botões no final
    const botoes = document.createElement('div');
    botoes.classList.add('botao-acao');

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.classList.add('editar');
    btnEditar.onclick = () => {
        document.getElementById('cliente').value = cliente;
        document.getElementById('contrato').value = contrato;
        document.getElementById('tipo').value = tipo;
        document.getElementById('status').value = status;
        document.getElementById('obs').value = obs;

        totalAtendimentos--;
        if (tipo.toLowerCase() === 'cancelado') totalCancelamentos--;
        atualizarEstatisticas();

        blocoNotas.removeChild(nota);
    };

    const btnApagar = document.createElement('button');
    btnApagar.textContent = 'Apagar';
    btnApagar.classList.add('apagar');
    btnApagar.onclick = () => {
        totalAtendimentos--;
        if (tipo.toLowerCase() === 'cancelado') totalCancelamentos--;
        atualizarEstatisticas();
        blocoNotas.removeChild(nota);
    };

    botoes.appendChild(btnEditar);
    botoes.appendChild(btnApagar);
    nota.appendChild(botoes);

    // Atualiza estatísticas
    totalAtendimentos++;
    if (tipo.toLowerCase() === 'cancelado') totalCancelamentos++;
    atualizarEstatisticas();

    // Limpa campos
    document.getElementById('cliente').value = '';
    document.getElementById('contrato').value = '';
    document.getElementById('tipo').value = 'Venda';
    document.getElementById('status').value = 'Retido';
    document.getElementById('obs').value = '';
}

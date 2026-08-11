document.addEventListener('DOMContentLoaded', () => {
    carregarTemaSalvo();
});

// --- CONTROLE DE TEMA ---
function alternarTema() {
    const body = document.body;
    const iconeTema = document.getElementById('iconeTema');

    if (body.classList.contains('dark-mode')) {
        body.classList.replace('dark-mode', 'light-mode');
        iconeTema.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('nathan_temaSistema', 'light');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        iconeTema.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('nathan_temaSistema', 'dark');
    }
}

function carregarTemaSalvo() {
    const temaSalvo = localStorage.getItem('nathan_temaSistema');
    const body = document.body;
    const iconeTema = document.getElementById('iconeTema');

    if (temaSalvo === 'light') {
        body.classList.replace('dark-mode', 'light-mode');
        if (iconeTema) iconeTema.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.classList.replace('light-mode', 'dark-mode');
        if (iconeTema) iconeTema.classList.replace('fa-sun', 'fa-moon');
    }
}

// --- FUNÇÕES DO BANCO DE DADOS (FIREBASE FIRESTORE) ---

async function salvarAtendimento() {
    const cliente = document.getElementById('cliente').value.trim();
    const contrato = document.getElementById('contrato').value.trim();
    const tipo = document.getElementById('tipo').value;
    const status = document.getElementById('status').value;
    const obs = document.getElementById('obs').value.trim();

    if (!cliente || !contrato || !tipo || !status) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const form = document.querySelector('.formulario');
    const editId = form.dataset.editId;

    try {
        if (editId) {
            const docRef = window.doc(window.db, "atendimentos", editId);
            await window.updateDoc(docRef, { cliente, contrato, tipo, status, obs });
            
            delete form.dataset.editId;
            form.querySelector('.btn-salvar').innerHTML = '<i class="fa-solid fa-plus"></i> Salvar Atendimento';
        } else {
            await window.addDoc(window.colRef, {
                cliente,
                contrato,
                tipo,
                status,
                obs,
                criadoEm: new Date().toISOString()
            });
        }

        form.reset();
        carregarDadosDoBanco();
    } catch (e) {
        console.error("Erro ao salvar no Firebase: ", e);
        alert("Erro ao salvar atendimento. Verifique a conexão.");
    }
}

async function carregarDadosDoBanco() {
    if (!window.db) return;

    const lista = document.getElementById('listaAtendimentos');
    lista.innerHTML = `<div class="sem-registros">Carregando da nuvem...</div>`;

    try {
        const querySnapshot = await window.getDocs(window.colRef);
        let atendimentos = [];

        querySnapshot.forEach((docSnap) => {
            atendimentos.push({ id: docSnap.id, ...docSnap.data() });
        });

        atendimentos.sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm));

        let total = atendimentos.length;
        let cancelados = atendimentos.filter(a => a.tipo === 'Cancelado').length;
        let taxa = total > 0 ? ((cancelados / total) * 100).toFixed(2) : 0;

        document.getElementById('totalAtendimentos').innerText = total;
        document.getElementById('totalCancelamentos').innerText = cancelados;
        document.getElementById('taxaCancelamento').innerText = taxa + '%';

        lista.innerHTML = '';

        if (total === 0) {
            lista.innerHTML = `<div class="sem-registros">Nenhum atendimento registrado ainda.</div>`;
            return;
        }

        const coresTipos = {
            'Venda': '#3b82f6',
            'Suporte': '#eab308',
            'Retido': '#10b981',
            'Cancelado': '#ef4444',
            'Transferida': '#ec4899',
            'Combo Multi': '#3b82f6',
            'Informações': '#eab308'
        };

        atendimentos.forEach((a, index) => {
            const corBorda = coresTipos[a.tipo] || '#8b5cf6';

            lista.innerHTML += `
                <div class="registro-card" style="border-left-color: ${corBorda};">
                    <div class="registro-topo">
                        <span>#${index + 1} - ${a.cliente}</span>
                        <span style="color: ${corBorda};">${a.tipo}</span>
                    </div>
                    <div class="registro-detalhes">
                        <div>Contrato: <span>${a.contrato}</span></div>
                        <div>Status: <span>${a.status}</span></div>
                        ${a.obs ? `<div style="grid-column: span 2;">Obs: <span>${a.obs}</span></div>` : ''}
                    </div>
                    <div class="botoes-acao-card">
                        <button type="button" onclick='editarAtendimento("${a.id}", ${JSON.stringify(a)})'>Editar</button>
                        <button type="button" class="apagar-btn" onclick="apagarAtendimento('${a.id}')">Apagar</button>
                    </div>
                </div>
            `;
        });

    } catch (e) {
        console.error("Erro ao carregar dados: ", e);
        lista.innerHTML = `<div class="sem-registros">Erro ao carregar dados do servidor.</div>`;
    }
}

async function apagarAtendimento(id) {
    if (confirm('Deseja realmente apagar este atendimento da nuvem?')) {
        try {
            await window.deleteDoc(window.doc(window.db, "atendimentos", id));
            carregarDadosDoBanco();
        } catch (e) {
            console.error("Erro ao apagar: ", e);
            alert("Erro ao excluir registro.");
        }
    }
}

function editarAtendimento(id, a) {
    document.getElementById('cliente').value = a.cliente;
    document.getElementById('contrato').value = a.contrato;
    document.getElementById('tipo').value = a.tipo;
    document.getElementById('status').value = a.status;
    document.getElementById('obs').value = a.obs || '';

    const form = document.querySelector('.formulario');
    form.dataset.editId = id;
    form.querySelector('.btn-salvar').innerHTML = '<i class="fa-solid fa-rotate"></i> Atualizar Atendimento';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

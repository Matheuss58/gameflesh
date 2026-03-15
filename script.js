document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const tasksList = document.getElementById('tasks-list');
    const currentXpElement = document.getElementById('current-xp');
    const maxXpElement = document.getElementById('max-xp');
    const xpProgress = document.getElementById('xp-progress');
    const streakDaysElement = document.getElementById('streak-days');
    const currentLevelElement = document.getElementById('current-level');
    const levelTitleElement = document.getElementById('level-title');
    const notification = document.getElementById('notification');
    const completeSound = document.getElementById('complete-sound');
    const rewardSound = document.getElementById('reward-sound');
    const levelUpSound = document.getElementById('level-up-sound');
    const slotSound = document.getElementById('slot-sound');
    const rewardsBtn = document.getElementById('rewards-btn');
    const homeBtn = document.getElementById('home-btn');
    const levelBtn = document.getElementById('level-btn');
    const pendingBtn = document.getElementById('pending-btn');
    const historyBtn = document.getElementById('history-btn');
    const resetTasksBtn = document.getElementById('reset-tasks-btn');
    const resetLevelBtn = document.getElementById('reset-level-btn');
    const historyModal = document.getElementById('history-modal');
    const historyList = document.getElementById('history-list');
    const rewardModal = document.getElementById('reward-modal');
    const rewardSlots = document.getElementById('reward-slots');
    const reward1Element = document.getElementById('reward-1');
    const reward2Element = document.getElementById('reward-2');
    const claimRewardsBtn = document.getElementById('claim-rewards-btn');
    const closeModal = document.querySelector('.close-modal');
    const closeRewardModal = document.querySelector('.close-reward-modal');
    const closePendingModal = document.querySelector('.close-pending-modal');
    const sectionTitle = document.getElementById('section-title');
    const pendingModal = document.getElementById('pending-modal');
    const addPendingBtn = document.getElementById('add-pending-btn');
    const pendingTaskName = document.getElementById('pending-task-name');
    const pendingTaskXp = document.getElementById('pending-task-xp');
    const pendingTaskDate = document.getElementById('pending-task-date');

    // Configurações
    const BASE_XP_LIMIT = 500;
    const REWARDS_PER_LEVEL = 2;
    const LEVEL_TITLES = {
        1: "Novato",
        11: "Aprendiz",
        21: "Iniciante",
        31: "Intermediário",
        41: "Avançado",
        51: "Experiente",
        61: "Profissional",
        71: "Mestre",
        81: "Grão-Mestre",
        91: "Lendário",
        101: "Épico",
        151: "Mítico",
        201: "Lendário",
        301: "Divino",
        501: "Supremo",
        751: "Transcendente",
        1001: "Gênioflesh"
    };

    // Dados do usuário
    let userData = {
        xp: 0,
        level: 1,
        streak: 0,
        lastActiveDate: null,
        tasks: [],
        rewards: [],
        availableRewards: [],
        history: {},
        pendingRewards: [],
        pendingTasks: []
    };

    // Tarefas padrão
    const defaultTasks = [
        { name: "DESENHO TÉCNICO I", xp: 100, completed: false },
        { name: "INTRODUÇÃO À ELETROQUÍMICA", xp: 100, completed: false },
        { name: "INTRODUÇÃO À EXTENSÃO EM ENGENHARIA ELÉTRICA", xp: 100, completed: false },
        { name: "INTRODUÇÃO À GEOMETRIA ANALÍTICA E ÁLGEBRA LINEAR", xp: 100, completed: false },
        { name: "METODOLOGIA DE PESQUISA PARA ENGENHEIROS ELETRICISTAS", xp: 100, completed: false },
        { name: "PROGRAMAÇÃO DE COMPUTADORES", xp: 100, completed: false },
        { name: "PRÉ-CÁLCULO", xp: 100, completed: false }
    ];

    // Recompensas disponíveis
    const defaultAvailableRewards = [
        "Você é sensacional.",
        "Você é extraordinário.",
        "Você é incrível.",
        "Você é raro.",
        "Você é diferente de um jeito bom.",
        "Você é necessário.",
        "Você é luz.",
        "Você é inspiração.",
        "Você é forte.",
        "Você é imparável.",
        "Você é gigante.",
        "Você é fora da curva.",
        "Você é talento puro.",
        "Você é determinado.",
        "Você é disciplina em forma humana.",
        "Você é capaz de coisas absurdas.",
        "Você é mais do que imagina.",
        "Você é feito pra vencer.",
        "Você é protagonista da sua própria história.",
        "Você é aquele tipo de pessoa que não passa despercebida.",
    ];

    // ========== FUNÇÕES PRINCIPAIS ========== //

function loadUserData() {
    const savedData = localStorage.getItem('lifeGamificationData');
    if (savedData) {
        userData = JSON.parse(savedData);
        checkDailyReset();
        
        // Sincronizar nível com o perfil
        const profileData = localStorage.getItem('lifeGamificationProfile');
        if (profileData) {
            const profile = JSON.parse(profileData);
            if (profile.level !== userData.level) {
                profile.level = userData.level;
                localStorage.setItem('lifeGamificationProfile', JSON.stringify(profile));
            }
        }
    } else {
        resetTasks();
        userData.availableRewards = [...defaultAvailableRewards];
        saveUserData();
    }
    
    if (userData.pendingRewards.length > 0) {
        setTimeout(() => showRewardModal(userData.pendingRewards), 1000);
    }
    
    updateUI();
}

    function saveUserData() {
        localStorage.setItem('lifeGamificationData', JSON.stringify(userData));
    }

    function resetTasks() {
        userData.tasks = JSON.parse(JSON.stringify(defaultTasks));
        saveUserData();
        updateUI();
        showNotification("Tarefas resetadas com sucesso!", "success");
    }

    function resetLevel() {
        if (!confirm("Tem certeza que deseja resetar seu nível? Você voltará para o nível 1 com 0 XP.")) {
            return;
        }
        
        userData.level = 1;
        userData.xp = 0;
        saveUserData();
        updateUI();
        showNotification("Nível resetado com sucesso!", "success");
    }

    function checkDailyReset() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!userData.lastActiveDate) {
            userData.lastActiveDate = today;
            saveUserData();
            return;
        }

        if (userData.lastActiveDate === today) return;

        const yesterdayXp = calculateDailyXp();
        if (yesterdayXp > 0) {
            userData.history[userData.lastActiveDate] = yesterdayXp;
        }

        resetTasks();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (userData.lastActiveDate === yesterdayStr) {
            userData.streak++;
            showNotification(`🔥 Sequência mantida! ${userData.streak} dias`, 'success');
        } else if (userData.lastActiveDate !== today) {
            if (userData.streak > 0) {
                showNotification(`💤 Sequência quebrada após ${userData.streak} dias`, 'error');
            }
            userData.streak = 0;
        }
        
        userData.lastActiveDate = today;
        saveUserData();
    }

    function calculateDailyXp() {
        return userData.tasks.reduce((total, task) => {
            return task.completed ? total + task.xp : total;
        }, 0);
    }

    function getXpLimitForLevel(level) {
        return BASE_XP_LIMIT + Math.floor(level / 10) * 50;
    }

    function getLevelTitle(level) {
        const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => b - a);
        for (const threshold of thresholds) {
            if (level >= threshold) {
                return LEVEL_TITLES[threshold];
            }
        }
        return "Iniciante";
    }

    function checkLevelUp() {
        const xpLimit = getXpLimitForLevel(userData.level);
        
        if (userData.xp >= xpLimit) {
            userData.xp -= xpLimit;
            userData.level++;
            
            const rewards = getRandomRewards(REWARDS_PER_LEVEL);
            userData.pendingRewards = rewards;
            
            showNotification(`🎉 Nível ${userData.level} alcançado! Ganhe suas recompensas!`, 'success');
            levelUpSound.play();
            
            showRewardModal(rewards);
            saveUserData();
            return true;
        }
        return false;
    }

    function getRandomRewards(count) {
        const available = [...userData.availableRewards];
        const rewards = [];
        
        for (let i = 0; i < count && available.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * available.length);
            rewards.push(available[randomIndex]);
            available.splice(randomIndex, 1);
        }
        
        return rewards;
    }

    function showRewardModal(rewards) {
        reward1Element.textContent = "";
        reward2Element.textContent = "";
        rewardSlots.querySelectorAll('.reward-icon').forEach(icon => {
            icon.classList.add('spinning');
            icon.textContent = "🎰";
        });
        
        rewardModal.style.display = "block";
        slotSound.play();
        
        setTimeout(() => {
            rewardSlots.querySelectorAll('.reward-icon').forEach(icon => {
                icon.classList.remove('spinning');
            });
            
            if (rewards[0]) {
                reward1Element.textContent = rewards[0];
                rewardSlots.querySelectorAll('.reward-icon')[0].textContent = "🎁";
            }
            
            if (rewards[1]) {
                reward2Element.textContent = rewards[1];
                rewardSlots.querySelectorAll('.reward-icon')[1].textContent = "🎁";
            }
        }, 2000);
    }

    function claimRewards() {
        userData.rewards.push(...userData.pendingRewards);
        userData.pendingRewards = [];
        rewardModal.style.display = "none";
        rewardSound.play();
        showNotification("Recompensas adicionadas ao seu inventário!", "success");
        saveUserData();
        
        if (rewardsBtn.classList.contains('active')) {
            navigateToRewards();
        }
    }

    function consumeReward(index) {
        const reward = userData.rewards[index];
        userData.rewards.splice(index, 1);
        saveUserData();
        showNotification(`Recompensa usada: ${reward}`, "success");
        navigateToRewards();
    }

    function addPendingTask() {
        const name = pendingTaskName.value.trim();
        const xp = parseInt(pendingTaskXp.value);
        const date = pendingTaskDate.value;
        
        if (!name || isNaN(xp) || !date) {
            showNotification("Por favor, preencha todos os campos corretamente.", "error");
            return;
        }
        
        if (xp < 10 || xp > 500) {
            showNotification("O XP deve estar entre 10 e 500.", "error");
            return;
        }
        
        const newTask = {
            name,
            xp,
            date,
            completed: false
        };
        
        userData.pendingTasks.push(newTask);
        saveUserData();
        
        pendingTaskName.value = "";
        pendingTaskXp.value = "";
        pendingTaskDate.value = "";
        
        pendingModal.style.display = "none";
        showNotification("Tarefa pendente adicionada com sucesso!", "success");
        
        if (pendingBtn.classList.contains('active')) {
            navigateToPending();
        }
    }

    function movePendingToToday(index) {
        const task = userData.pendingTasks[index];
        userData.tasks.push({
            name: task.name,
            xp: task.xp,
            completed: false
        });
        
        userData.pendingTasks.splice(index, 1);
        saveUserData();
        showNotification("Tarefa movida para hoje!", "success");
        updateUI();
    }

    function deletePendingTask(index) {
        if (confirm("Tem certeza que deseja remover esta tarefa pendente?")) {
            userData.pendingTasks.splice(index, 1);
            saveUserData();
            showNotification("Tarefa pendente removida.", "success");
            updateUI();
        }
    }

    // ========== INTERFACE DO USUÁRIO ========== //

    function updateUI() {
        const xpLimit = getXpLimitForLevel(userData.level);
        
        currentXpElement.textContent = userData.xp;
        maxXpElement.textContent = xpLimit;
        streakDaysElement.textContent = userData.streak;
        currentLevelElement.textContent = userData.level;
        levelTitleElement.textContent = getLevelTitle(userData.level);
        
        const xpPercentage = Math.min((userData.xp / xpLimit) * 100, 100);
        xpProgress.style.width = `${xpPercentage}%`;
        
        tasksList.innerHTML = '';
        
        if (rewardsBtn.classList.contains('active')) {
            navigateToRewards();
        } else if (levelBtn.classList.contains('active')) {
            navigateToLevel();
        } else if (pendingBtn.classList.contains('active')) {
            navigateToPending();
        } else {
            navigateToHome();
        }
    }

    function showTasksList() {
        sectionTitle.textContent = "✅ Tarefas de Hoje";
        userData.tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = `task ${task.completed ? 'completed' : ''}`;
            taskElement.innerHTML = `
                <div class="task-checkbox-container">
                    <div class="task-checkbox">${task.completed ? '✓' : ''}</div>
                </div>
                <span class="task-text">${task.name}</span>
                <span class="xp">+${task.xp}</span>
            `;
            
            taskElement.addEventListener('click', () => toggleTask(index));
            tasksList.appendChild(taskElement);
        });
    }

    function showRewardsList() {
        sectionTitle.textContent = "🎁 Seu Inventário";
        const container = document.createElement('div');
        container.className = 'list';
        
        if (userData.rewards.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Nenhuma recompensa ainda. Complete tarefas para subir de nível e ganhar recompensas!';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            emptyMsg.style.color = '#666';
            container.appendChild(emptyMsg);
        } else {
            userData.rewards.forEach((reward, index) => {
                const rewardElement = document.createElement('div');
                rewardElement.className = 'reward';
                rewardElement.innerHTML = `
                    <span class="reward-text">${reward}</span>
                    <span class="cost">Usar</span>
                `;
                rewardElement.addEventListener('click', () => consumeReward(index));
                container.appendChild(rewardElement);
            });
        }
        
        tasksList.appendChild(container);
    }

    function showPendingList() {
        sectionTitle.textContent = "⏰ Tarefas Pendentes";
        const container = document.createElement('div');
        container.className = 'list';
        
        if (userData.pendingTasks.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'Nenhuma tarefa pendente. Adicione tarefas para concluir em uma data futura!';
            emptyMsg.style.textAlign = 'center';
            emptyMsg.style.padding = '20px';
            emptyMsg.style.color = '#666';
            container.appendChild(emptyMsg);
        } else {
            userData.pendingTasks.forEach((task, index) => {
                const taskElement = document.createElement('div');
                taskElement.className = 'pending-task';
                
                const dueDate = task.date ? new Date(task.date).toLocaleDateString('pt-BR') : "Sem data";
                
                taskElement.innerHTML = `
                    <div>
                        <div class="task-text">${task.name}</div>
                        <div class="due-date">⏳ ${dueDate}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="xp">+${task.xp}</span>
                        <button class="move-today-btn" data-index="${index}">Hoje</button>
                        <button class="delete-pending-btn" data-index="${index}">🗑️</button>
                    </div>
                `;
                
                container.appendChild(taskElement);
            });
        }
        
        // Adiciona botão para adicionar nova tarefa pendente
        const addButton = document.createElement('button');
        addButton.className = 'add-pending-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i> Adicionar Tarefa Pendente';
        addButton.addEventListener('click', () => {
            pendingModal.style.display = 'block';
        });
        
        container.appendChild(addButton);
        tasksList.appendChild(container);
        
        // Adiciona event listeners aos botões dinamicamente
        document.querySelectorAll('.move-today-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                movePendingToToday(index);
            });
        });
        
        document.querySelectorAll('.delete-pending-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                deletePendingTask(index);
            });
        });
    }

    function showLevelInfo() {
        sectionTitle.textContent = "📊 Progresso";
        const xpLimit = getXpLimitForLevel(userData.level);
        const xpToNextLevel = xpLimit - userData.xp;
        
        const container = document.createElement('div');
        container.className = 'level-info';
        
        container.innerHTML = `
            <div class="level-stat">
                <span class="stat-label">Nível atual:</span>
                <span class="stat-value">${userData.level} (${getLevelTitle(userData.level)})</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">XP atual:</span>
                <span class="stat-value">${userData.xp}/${xpLimit}</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Faltam para próximo nível:</span>
                <span class="stat-value">${xpToNextLevel} XP</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Sequência atual:</span>
                <span class="stat-value">${userData.streak} dias</span>
            </div>
            <div class="level-stat">
                <span class="stat-label">Próximo título:</span>
                <span class="stat-value">${getNextLevelTitle()}</span>
            </div>
        `;
        
        tasksList.appendChild(container);
    }

    function getNextLevelTitle() {
        const currentLevel = userData.level;
        const thresholds = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => a - b);
        
        for (const threshold of thresholds) {
            if (threshold > currentLevel) {
                return `Nível ${threshold} (${LEVEL_TITLES[threshold]})`;
            }
        }
        
        return "Nenhum (você alcançou o nível máximo!)";
    }

    function showHistory() {
        historyList.innerHTML = '';
        
        if (!userData.history || Object.keys(userData.history).length === 0) {
            historyList.innerHTML = '<p class="no-history">Nenhum registro histórico encontrado.</p>';
            return;
        }
        
        const sortedDates = Object.keys(userData.history).sort((a, b) => new Date(b) - new Date(a));
        
        sortedDates.forEach(date => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-date">${formatDate(date)}</span>
                <span class="history-xp">${userData.history[date]} XP</span>
            `;
            historyList.appendChild(historyItem);
        });
        
        historyModal.style.display = 'block';
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    }

    function toggleTask(index) {
        const task = userData.tasks[index];
        
        if (task.completed) {
            task.completed = false;
            userData.xp -= task.xp;
            if (userData.xp < 0) userData.xp = 0;
            showNotification(`❌ Tarefa desfeita! -${task.xp} XP`, 'error');
        } else {
            task.completed = true;
            userData.xp += task.xp;
            showNotification(`✅ Tarefa concluída! +${task.xp} XP`, 'success');
            completeSound.play();
            checkLevelUp();
        }
        
        saveUserData();
        updateUI();
    }

    function showNotification(message, type = 'success') {
        const iconClass = type === 'success' ? 'fa-check-circle' :
                          type === 'error' ? 'fa-times-circle' : 'fa-info-circle';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass} notification-icon"></i>
                <span class="notification-text">${message}</span>
            </div>
        `;

        notification.className = `notification ${type} show`;

        setTimeout(() => {
            notification.classList.replace('show', 'hide');
        }, 3000);
    }

    // ========== NAVEGAÇÃO ========== //

    function navigateToHome() {
        homeBtn.classList.add('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.remove('active');
        pendingBtn.classList.remove('active');
        showTasksList();
    }

    function navigateToRewards() {
        homeBtn.classList.remove('active');
        rewardsBtn.classList.add('active');
        levelBtn.classList.remove('active');
        pendingBtn.classList.remove('active');
        showRewardsList();
    }

    function navigateToLevel() {
        homeBtn.classList.remove('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.add('active');
        pendingBtn.classList.remove('active');
        showLevelInfo();
    }

    function navigateToPending() {
        homeBtn.classList.remove('active');
        rewardsBtn.classList.remove('active');
        levelBtn.classList.remove('active');
        pendingBtn.classList.add('active');
        showPendingList();
    }

    // ========== EVENT LISTENERS ========== //

    rewardsBtn.addEventListener('click', navigateToRewards);
    homeBtn.addEventListener('click', navigateToHome);
    levelBtn.addEventListener('click', navigateToLevel);
    pendingBtn.addEventListener('click', navigateToPending);
    historyBtn.addEventListener('click', showHistory);
    resetTasksBtn.addEventListener('click', resetTasks);
    resetLevelBtn.addEventListener('click', resetLevel);
    claimRewardsBtn.addEventListener('click', claimRewards);
    addPendingBtn.addEventListener('click', addPendingTask);
    
    closeModal.addEventListener('click', () => {
        historyModal.style.display = 'none';
    });
    
    closeRewardModal.addEventListener('click', () => {
        rewardModal.style.display = 'none';
    });
    
    closePendingModal.addEventListener('click', () => {
        pendingModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.style.display = 'none';
        }
        if (e.target === rewardModal) {
            rewardModal.style.display = 'none';
        }
        if (e.target === pendingModal) {
            pendingModal.style.display = 'none';
        }
    });

    // Configurar data mínima para o datepicker (hoje)
    pendingTaskDate.min = new Date().toISOString().split('T')[0];

const profileBtn = document.getElementById('profile-btn');

profileBtn.addEventListener('click', () => {
    window.location.href = "profile.html";
});

    // Inicializar
    loadUserData();
});

document.addEventListener("DOMContentLoaded", () => {
    // تحميل نص الفقرة المحددة في game03.js
    const paragraphElement = document.getElementById('paragraph');
    if (paragraphElement && gameData.paragraphHTML) {
        paragraphElement.innerHTML = gameData.paragraphHTML;
    }

    const correctAnswers = gameData.correctAnswers;
    const baseWordOptions = gameData.baseWordOptions;

    const userAnswers = Array(11).fill(""); 
    let currentShuffledOptions = []; 
    let selectedBlankIndex = null; 

    const coinStates = Array(11).fill(0); 
    let attemptCount = 1; 

    const coinsBar = document.getElementById('coinsBar');
    const blanks = document.querySelectorAll('.blank');
    const submitBtn = document.getElementById('submitBtn');
    const retryBtn = document.getElementById('retryBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const wordsGrid = document.getElementById('wordsGrid');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    const scoreModalOverlay = document.getElementById('scoreModalOverlay');
    const resAttempts = document.getElementById('resAttempts');
    const resGold = document.getElementById('resGold');
    const resSilver = document.getElementById('resSilver');
    const resBronze = document.getElementById('resBronze');
    const resMatte = document.getElementById('resMatte');
    const winCodeText = document.getElementById('winCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const restartGameBtn = document.getElementById('restartGameBtn');
    
    const audioCorrect = document.getElementById('soundCorrect');
    const audioWrong = document.getElementById('soundWrong');
    const audioDrop = document.getElementById('soundDrop'); 
    const backgroundMusic = document.getElementById('backgroundMusic');

    // أحداث شاشة البداية والموسيقى
    const welcomeScreen = document.getElementById('welcomeScreen');
    const startPlayBtn = document.getElementById('startPlayBtn');
    const gameWrapper = document.getElementById('gameWrapper');

    startPlayBtn.addEventListener('click', () => {
        backgroundMusic.play().catch(e => console.log("ملف background.mp3 غير موجود، أو يحتاج لتفاعل أولاً"));
        
        welcomeScreen.classList.add('fade-out');
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            gameWrapper.classList.add('fade-in');
        }, 800);
    });

    function shuffleArray(array) {
        let shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function updateCoinsUI() {
        coinsBar.innerHTML = '';
        for (let i = 0; i < 11; i++) {
            const coin = document.createElement('div');
            coin.id = `coin-${i}`;
            
            if (coinStates[i] === 1) {
                coin.className = 'coin gold';
            } else if (coinStates[i] === 2) {
                coin.className = 'coin silver';
            } else if (coinStates[i] === 3) {
                coin.className = 'coin bronze';
            } else if (coinStates[i] === 4) {
                coin.className = 'coin matte-gray';
            } else {
                coin.className = 'coin'; 
            }
            coinsBar.appendChild(coin);
        }
    }

    function initGame(resetAll = true) {
        if (resetAll) {
            coinStates.fill(0);
            attemptCount = 1;
            updateCoinsUI();
        } else {
            for (let i = 0; i < 11; i++) {
                if (coinStates[i] === 0) {
                    userAnswers[i] = "";
                }
            }
            updateCoinsUI();
        }

        currentShuffledOptions = shuffleArray(baseWordOptions);

        blanks.forEach((blank, idx) => {
            if (coinStates[idx] > 0) {
                blank.textContent = correctAnswers[idx];
                userAnswers[idx] = correctAnswers[idx];
                blank.className = "blank correct";
                blank.style.pointerEvents = 'none'; 
            } else {
                blank.textContent = `فراغ ${idx + 1}`;
                blank.style.color = "rgba(74, 144, 226, 0.4)"; 
                blank.style.borderBottom = "2px dashed var(--primary-color)";
                blank.style.backgroundColor = "rgba(74, 144, 226, 0.05)";
                blank.className = "blank"; 
                blank.style.pointerEvents = 'auto'; 
                userAnswers[idx] = "";
            }
        });

        submitBtn.disabled = false;
        submitBtn.style.display = "block";
        retryBtn.style.display = "none";
    }

    function playExternalSound(type) {
        if (type === 'correct') {
            audioCorrect.currentTime = 0;
            audioCorrect.play().catch(e => console.log("correct.mp3 غير موجود"));
        } else if (type === 'wrong') {
            audioWrong.currentTime = 0;
            audioWrong.play().catch(e => console.log("wrong.mp3 غير موجود"));
        } else if (type === 'drop') {
            audioDrop.currentTime = 0;
            audioDrop.play().catch(e => console.log("drop.mp3 غير موجود"));
        }
    }

    blanks.forEach((blank) => {
        blank.addEventListener('click', () => {
            selectedBlankIndex = parseInt(blank.getAttribute('data-index'));
            openWordSelector();
        });
    });

    function openWordSelector() {
        wordsGrid.innerHTML = '';
        const usedWords = userAnswers.filter((ans, idx) => idx !== selectedBlankIndex && ans !== "");
        const availableWords = currentShuffledOptions.filter(word => !usedWords.includes(word));

        if (userAnswers[selectedBlankIndex] !== "") {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'word-option';
            clearBtn.style.background = 'rgba(231, 76, 60, 0.1)';
            clearBtn.style.color = '#e74c3c';
            clearBtn.style.borderColor = 'rgba(231, 76, 60, 0.3)';
            clearBtn.textContent = 'إزالة الكلمة الحالية ✖';
            clearBtn.addEventListener('click', () => selectWord(""));
            wordsGrid.appendChild(clearBtn);
        }

        availableWords.forEach((word) => {
            const btn = document.createElement('button');
            btn.className = 'word-option';
            btn.textContent = word;
            btn.addEventListener('click', () => selectWord(word));
            wordsGrid.appendChild(btn);
        });

        modalOverlay.classList.add('active');
    }

    function closeModal() {
        modalOverlay.classList.remove('active');
        selectedBlankIndex = null;
    }

    function selectWord(word) {
        const targetBlank = blanks[selectedBlankIndex];
        userAnswers[selectedBlankIndex] = word;

        playExternalSound('drop'); 

        if (word === "") {
            targetBlank.textContent = `فراغ ${selectedBlankIndex + 1}`;
            targetBlank.style.color = "rgba(74, 144, 226, 0.4)";
            targetBlank.style.borderBottom = "2px dashed var(--primary-color)";
            targetBlank.style.backgroundColor = "rgba(74, 144, 226, 0.05)";
        } else {
            targetBlank.textContent = word;
            targetBlank.style.color = "var(--primary-color)";
            targetBlank.style.borderBottom = "2px solid var(--primary-color)";
            targetBlank.style.backgroundColor = "rgba(74, 144, 226, 0.15)";
        }
        
        closeModal();
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    submitBtn.addEventListener('click', () => {
        submitBtn.disabled = true; 
        blanks.forEach(b => b.style.pointerEvents = 'none'); 

        const activeIndexes = [];
        for (let i = 0; i < 11; i++) {
            if (coinStates[i] === 0) {
                activeIndexes.push(i);
            }
        }

        let currentIndex = 0;

        function processNext() {
            if (currentIndex >= activeIndexes.length) {
                setTimeout(() => {
                    const unsolvedCount = coinStates.filter(state => state === 0).length;
                    
                    if (unsolvedCount > 0) {
                        submitBtn.style.display = "none";
                        retryBtn.style.display = "block";
                    } else {
                        showFinalReport();
                    }
                }, 1000);
                return;
            }

            const idx = activeIndexes[currentIndex];
            const blank = blanks[idx];
            const playerAns = userAnswers[idx];
            const correctAns = correctAnswers[idx];
            const correspondingCoin = document.getElementById(`coin-${idx}`);

            blank.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                if (playerAns === correctAns && playerAns !== "") {
                    blank.className = "blank correct";
                    
                    if (attemptCount === 1) {
                        coinStates[idx] = 1; 
                        correspondingCoin.className = 'coin gold';
                    } else if (attemptCount === 2) {
                        coinStates[idx] = 2; 
                        correspondingCoin.className = 'coin silver';
                    } else if (attemptCount === 3) {
                        coinStates[idx] = 3; 
                        correspondingCoin.className = 'coin bronze';
                    } else {
                        coinStates[idx] = 4; 
                        correspondingCoin.className = 'coin matte-gray';
                    }
                    
                    playExternalSound('correct');
                } else {
                    blank.className = "blank wrong";
                    playExternalSound('wrong');
                }

                currentIndex++;
                setTimeout(processNext, 1200);

            }, 400); 
        }

        processNext();
    });

    function generateWinCode(gold, silver, bronze, matte, attempts) {
        const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
        return `WIN-G${gold}S${silver}B${bronze}M${matte}-A${attempts}-${randomHex}`;
    }

    function showFinalReport() {
        const goldCount = coinStates.filter(state => state === 1).length;
        const silverCount = coinStates.filter(state => state === 2).length;
        const bronzeCount = coinStates.filter(state => state === 3).length;
        const matteCount = coinStates.filter(state => state === 4).length;

        resAttempts.textContent = attemptCount;
        resGold.textContent = goldCount;
        resSilver.textContent = silverCount;
        resBronze.textContent = bronzeCount;
        resMatte.textContent = matteCount;

        const generatedCode = generateWinCode(goldCount, silverCount, bronzeCount, matteCount, attemptCount);
        winCodeText.textContent = generatedCode;

        copyCodeBtn.onclick = function() {
            navigator.clipboard.writeText(generatedCode).then(() => {
                copyCodeBtn.textContent = "تم النسخ! ✓";
                copyCodeBtn.style.background = "#2ecc71";
                setTimeout(() => {
                    copyCodeBtn.textContent = "نسخ 📋";
                    copyCodeBtn.style.background = "#34495e";
                }, 2000);
            });
        };

        scoreModalOverlay.classList.add('active');
    }

    retryBtn.addEventListener('click', () => {
        attemptCount++; 
        initGame(false);
    });

    restartGameBtn.addEventListener('click', () => {
        scoreModalOverlay.classList.remove('active');
        initGame(true);
    });

    initGame(true);
});
  

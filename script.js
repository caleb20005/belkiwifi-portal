/* ============================================
   BelkiSolutions WiFi - JavaScript
   Complete Payment Verification System
   ============================================ */

// ============================================
// INITIAL PAGE LOADER
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('initialLoader');
        loader.classList.add('hide');
        
        setTimeout(() => {
            document.getElementById('mainHeader').style.display = 'flex';
            document.getElementById('mainContent').style.display = 'block';
            document.getElementById('mainFooter').style.display = 'block';
            showToast('📶 Welcome to BelkiSolutions WiFi!', 'success');
        }, 600);
    }, 2000);
});

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'default') {
    const toast = document.getElementById('toast');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ============================================
// PAYMENT VERIFICATION STATE
// ============================================
let countdownInterval = null;
let currentCountdown = 30;

// ============================================
// PACKAGE SELECTION & PAYMENT MODAL
// ============================================
function selectPackage(packageName, amount) {
    document.getElementById('modalPackage').textContent = packageName;
    document.getElementById('modalAmount').textContent = `KSH ${amount}/-`;
    document.getElementById('paymentModal').classList.add('active');
    
    document.getElementById('paymentForm').dataset.package = packageName;
    document.getElementById('paymentForm').dataset.amount = amount;
}

function closeModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

document.getElementById('paymentModal').addEventListener('click', (e) => {
    if (e.target.id === 'paymentModal') closeModal();
});

// ============================================
// PAYMENT FORM SUBMISSION
// ============================================
document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phone = document.getElementById('paymentPhone').value;
    const packageName = e.target.dataset.package;
    const amount = e.target.dataset.amount;
    
    closeModal();
    document.getElementById('paymentPhone').value = '';
    
    startPaymentVerification(packageName, amount, phone);
});

// ============================================
// PAYMENT VERIFICATION SYSTEM
// ============================================
function startPaymentVerification(packageName, amount, phone) {
    document.getElementById('txPackage').textContent = packageName;
    document.getElementById('txAmount').textContent = `KSH ${amount}/-`;
    document.getElementById('txPhone').textContent = phone;
    document.getElementById('txId').textContent = generateTransactionId();
    
    document.getElementById('paymentLoader').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    resetProgressSteps();
    startCountdown();
    
    setTimeout(() => activateStage(1, 'Sending STK Push', 
        `Pushing payment request to ${phone}...`), 500);
    
    setTimeout(() => activateStage(2, 'Awaiting M-Pesa PIN', 
        '📱 Please enter your M-Pesa PIN on your phone'), 2500);
    
    setTimeout(() => activateStage(3, 'Verifying Payment', 
        '🔒 Authenticating transaction with Safaricom...'), 10500);
    
    setTimeout(() => activateStage(4, 'Activating Package', 
        '⚡ Setting up your internet connection...'), 20500);
    
    setTimeout(() => {
        clearIntervals();
        showSuccessAnimation(packageName, amount, phone, document.getElementById('txId').textContent);
    }, 25500);
}

// ============================================
// GENERATE TRANSACTION ID
// ============================================
function generateTransactionId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ============================================
// RESET PROGRESS STEPS
// ============================================
function resetProgressSteps() {
    for (let i = 1; i <= 4; i++) {
        document.getElementById(`step${i}`).classList.remove('active', 'completed');
    }
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`line${i}`).classList.remove('active');
    }
}

// ============================================
// ACTIVATE STAGE
// ============================================
function activateStage(stageNum, title, description) {
    const currentStep = document.getElementById(`step${stageNum}`);
    const prevStep = document.getElementById(`step${stageNum - 1}`);
    const prevLine = document.getElementById(`line${stageNum - 1}`);
    
    if (prevStep && stageNum > 1) {
        prevStep.classList.remove('active');
        prevStep.classList.add('completed');
    }
    
    if (prevLine && stageNum > 1) {
        prevLine.classList.add('active');
    }
    
    currentStep.classList.add('active');
    document.getElementById('loaderStageTitle').textContent = title;
    document.getElementById('loaderStageDesc').textContent = description;
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function startCountdown() {
    currentCountdown = 30;
    const countdownEl = document.getElementById('countdownNumber');
    const countdownText = document.querySelector('.countdown-text');
    const progressCircle = document.getElementById('countdownProgress');
    
    const circumference = 2 * Math.PI * 45;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = 0;
    
    countdownInterval = setInterval(() => {
        currentCountdown--;
        countdownEl.textContent = currentCountdown;
        
        const offset = circumference - (currentCountdown / 30) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        
        if (currentCountdown <= 5) {
            countdownText.classList.remove('warning');
            countdownText.classList.add('danger');
            progressCircle.style.stroke = 'var(--danger)';
        } else if (currentCountdown <= 10) {
            countdownText.classList.add('warning');
            countdownText.classList.remove('danger');
            progressCircle.style.stroke = 'var(--warning)';
        } else {
            countdownText.classList.remove('warning', 'danger');
            progressCircle.style.stroke = 'var(--primary)';
        }
        
        if (currentCountdown <= 0) clearInterval(countdownInterval);
    }, 1000);
}

// ============================================
// CLEAR INTERVALS
// ============================================
function clearIntervals() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// ============================================
// SHOW SUCCESS ANIMATION
// ============================================
function showSuccessAnimation(packageName, amount, phone, txId) {
    document.getElementById('paymentLoader').classList.remove('active');
    
    setTimeout(() => {
        document.getElementById('successMessage').textContent = 
            `${packageName} package activated successfully!`;
        
        document.getElementById('successDetails').innerHTML = `
            <div class="tx-row">
                <span class="tx-label">Package:</span>
                <span class="tx-value">${packageName}</span>
            </div>
            <div class="tx-row">
                <span class="tx-label">Amount Paid:</span>
                <span class="tx-value">KSH ${amount}/-</span>
            </div>
            <div class="tx-row">
                <span class="tx-label">Phone:</span>
                <span class="tx-value">${phone}</span>
            </div>
            <div class="tx-row">
                <span class="tx-label">Transaction ID:</span>
                <span class="tx-value tx-id">${txId}</span>
            </div>
            <div class="tx-row">
                <span class="tx-label">Status:</span>
                <span class="tx-value" style="color: var(--success);">
                    <i class="fas fa-check-circle"></i> Active
                </span>
            </div>
        `;
        
        document.getElementById('successOverlay').classList.add('active');
        
        setTimeout(() => hideSuccessAndRedirect(), 3500);
    }, 300);
}

// ============================================
// HIDE SUCCESS & REDIRECT
// ============================================
function hideSuccessAndRedirect() {
    document.getElementById('successOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    showToast('✅ Payment complete! Please login with your credentials.', 'success');
    
    setTimeout(() => {
        const loginCard = document.querySelector('.login-card-section');
        if (loginCard) {
            loginCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            loginCard.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)';
            setTimeout(() => { loginCard.style.boxShadow = ''; }, 2000);
        }
    }, 500);
}

// ============================================
// CANCEL PAYMENT
// ============================================
function cancelPayment() {
    if (confirm('Are you sure you want to cancel this payment?')) {
        clearIntervals();
        document.getElementById('paymentLoader').classList.remove('active');
        document.body.style.overflow = 'auto';
        showToast('❌ Payment cancelled', 'error');
    }
}

// ============================================
// RECONNECT FORM SUBMISSION
// ============================================
document.getElementById('reconnectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const mpesaCode = document.getElementById('mpesaCode').value.toUpperCase().trim();
    const phone = document.getElementById('reconnectPhone').value.trim();
    
    if (mpesaCode.length < 8) {
        showToast('❌ Please enter a valid M-Pesa code', 'error');
        return;
    }
    
    if (phone.length !== 10) {
        showToast('❌ Please enter a valid 10-digit phone number', 'error');
        return;
    }
    
    startPaymentVerification('Reconnection', 'Already Paid', phone);
    
    setTimeout(() => activateStage(1, 'Validating M-Pesa Code', 
        `Verifying transaction ${mpesaCode}...`), 500);
    setTimeout(() => activateStage(2, 'Checking Account', 
        'Looking up your previous account...'), 2500);
    setTimeout(() => activateStage(3, 'Restoring Session', 
        'Reconnecting your WiFi session...'), 10500);
    setTimeout(() => activateStage(4, 'Reactivating Access', 
        'Restoring your internet connection...'), 20500);
});

// ============================================
// VOUCHER FORM SUBMISSION
// ============================================
document.getElementById('voucherForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const voucherCode = document.getElementById('voucherCode').value.toUpperCase().trim();
    
    if (voucherCode.length < 6) {
        showToast('❌ Please enter a valid voucher code', 'error');
        return;
    }
    
    showToast(`⚡ Recharging voucher ${voucherCode}...`, 'success');
    
    setTimeout(() => {
        showToast(`✅ Voucher recharged successfully! Enjoy your internet.`, 'success');
        document.getElementById('voucherForm').reset();
    }, 2500);
});

// ============================================
// LOGIN FORM SUBMISSION
// ============================================
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showToast('❌ Please fill in all fields', 'error');
        return;
    }
    
    showToast(`🔐 Logging in as ${username}...`, 'default');
    
    setTimeout(() => {
        showToast(`✅ Welcome ${username}! Connecting to WiFi...`, 'success');
    }, 2000);
});

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================
document.getElementById('togglePassword').addEventListener('click', () => {
    const passwordInput = document.getElementById('loginPassword');
    const toggleIcon = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
});

// ============================================
// AUTO-UPPERCASE CODES
// ============================================
['mpesaCode', 'voucherCode'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });
});

// ============================================
// PHONE NUMBER VALIDATION
// ============================================
['reconnectPhone', 'paymentPhone'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
    });
});

// ============================================
// REMEMBER ME FUNCTIONALITY
// ============================================
window.addEventListener('load', () => {
    const savedUsername = localStorage.getItem('belki_username');
    if (savedUsername) {
        setTimeout(() => {
            document.getElementById('loginUsername').value = savedUsername;
            document.getElementById('rememberMe').checked = true;
        }, 2700);
    }
});

document.getElementById('loginForm').addEventListener('submit', () => {
    if (document.getElementById('rememberMe').checked) {
        localStorage.setItem('belki_username', document.getElementById('loginUsername').value);
    } else {
        localStorage.removeItem('belki_username');
    }
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        if (document.getElementById('successOverlay').classList.contains('active')) {
            hideSuccessAndRedirect();
        }
    }
});

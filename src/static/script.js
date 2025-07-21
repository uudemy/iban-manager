// Global değişkenler
let ibans = [];
let editingId = null;
let deletingId = null;

// DOM elementleri
const ibanForm = document.getElementById('ibanForm');
const editForm = document.getElementById('editForm');
const ibanGrid = document.getElementById('ibanGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const loadingOverlay = document.getElementById('loadingOverlay');

// Modal elementleri
const editModal = document.getElementById('editModal');
const deleteModal = document.getElementById('deleteModal');

// API Base URL
const API_BASE = '/api';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Uygulamayı başlat
function initializeApp() {
    loadIbans();
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Form submit
    ibanForm.addEventListener('submit', handleFormSubmit);
    editForm.addEventListener('submit', handleEditSubmit);
    
    // IBAN doğrulama
    document.getElementById('ibanNumber').addEventListener('input', validateIbanInput);
    document.getElementById('editIbanNumber').addEventListener('input', validateEditIbanInput);
    
    // Arama
    searchInput.addEventListener('input', handleSearch);
    
    // Modal kontrolleri
    document.getElementById('closeModal').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
    document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('confirmDelete').addEventListener('click', handleDelete);
    
    // Form iptal
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    
    // Modal dışına tıklama
    editModal.addEventListener('click', function(e) {
        if (e.target === editModal) closeEditModal();
    });
    
    deleteModal.addEventListener('click', function(e) {
        if (e.target === deleteModal) closeDeleteModal();
    });
}

// IBAN'ları yükle
async function loadIbans() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/ibans`);
        const data = await response.json();
        
        if (data.success) {
            ibans = data.data;
            renderIbans();
        } else {
            showToast('Hata', data.error, 'error');
        }
    } catch (error) {
        showToast('Hata', 'IBAN\'lar yüklenirken bir hata oluştu', 'error');
        console.error('Error loading IBANs:', error);
    } finally {
        hideLoading();
    }
}

// IBAN'ları render et
function renderIbans(filteredIbans = null) {
    const ibansToRender = filteredIbans || ibans;
    
    if (ibansToRender.length === 0) {
        ibanGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    ibanGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    ibanGrid.innerHTML = ibansToRender.map(iban => createIbanCard(iban)).join('');
}

// IBAN kartı oluştur
function createIbanCard(iban) {
    const formattedIban = formatIban(iban.iban_number);
    const createdDate = new Date(iban.created_at).toLocaleDateString('tr-TR');
    
    return `
        <div class="iban-card" data-id="${iban.id}">
            <div class="iban-card-header">
                <div class="iban-number">${formattedIban}</div>
                <div class="card-actions">
                    <button class="action-btn copy-btn" onclick="copyIban('${iban.iban_number}')" title="Kopyala">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editIban(${iban.id})" title="Düzenle">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="confirmDeleteIban(${iban.id})" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="iban-info">
                <div class="info-row">
                    <span class="info-label">Banka:</span>
                    <span class="info-value">${iban.bank_name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hesap Sahibi:</span>
                    <span class="info-value">${iban.account_holder}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Eklenme:</span>
                    <span class="info-value">${createdDate}</span>
                </div>
            </div>
            
            ${iban.description ? `<div class="description">${iban.description}</div>` : ''}
        </div>
    `;
}

// Form submit işlemi
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(ibanForm);
    const data = Object.fromEntries(formData.entries());
    
    // IBAN'ı temizle (boşlukları kaldır)
    data.iban_number = data.iban_number.replace(/\s/g, '');
    
    // IBAN doğrulama
    if (!await validateIban(data.iban_number)) {
        showToast('Hata', 'Geçersiz IBAN numarası', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/ibans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Başarılı', result.message, 'success');
            resetForm();
            loadIbans();
        } else {
            showToast('Hata', result.error, 'error');
        }
    } catch (error) {
        showToast('Hata', 'IBAN eklenirken bir hata oluştu', 'error');
        console.error('Error adding IBAN:', error);
    } finally {
        hideLoading();
    }
}

// Edit form submit işlemi
async function handleEditSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(editForm);
    const data = Object.fromEntries(formData.entries());
    const id = document.getElementById('editId').value;
    
    // IBAN'ı temizle (boşlukları kaldır)
    data.iban_number = data.iban_number.replace(/\s/g, '');
    
    // IBAN doğrulama
    if (!await validateIban(data.iban_number)) {
        showToast('Hata', 'Geçersiz IBAN numarası', 'error');
        return;
    }
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/ibans/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Başarılı', result.message, 'success');
            closeEditModal();
            loadIbans();
        } else {
            showToast('Hata', result.error, 'error');
        }
    } catch (error) {
        showToast('Hata', 'IBAN güncellenirken bir hata oluştu', 'error');
        console.error('Error updating IBAN:', error);
    } finally {
        hideLoading();
    }
}

// IBAN düzenle
function editIban(id) {
    const iban = ibans.find(i => i.id === id);
    if (!iban) return;
    
    editingId = id;
    
    // Form alanlarını doldur
    document.getElementById('editId').value = iban.id;
    document.getElementById('editIbanNumber').value = iban.iban_number;
    document.getElementById('editBankName').value = iban.bank_name;
    document.getElementById('editAccountHolder').value = iban.account_holder;
    document.getElementById('editDescription').value = iban.description || '';
    
    // Modal'ı aç
    editModal.classList.add('show');
}

// IBAN silme onayı
function confirmDeleteIban(id) {
    const iban = ibans.find(i => i.id === id);
    if (!iban) return;
    
    deletingId = id;
    
    // Silme bilgilerini göster
    document.getElementById('deleteInfo').innerHTML = `
        <div class="info-row">
            <span class="info-label">IBAN:</span>
            <span class="iban-number">${formatIban(iban.iban_number)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Banka:</span>
            <span class="info-value">${iban.bank_name}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Hesap Sahibi:</span>
            <span class="info-value">${iban.account_holder}</span>
        </div>
    `;
    
    // Modal'ı aç
    deleteModal.classList.add('show');
}

// IBAN sil
async function handleDelete() {
    if (!deletingId) return;
    
    try {
        showLoading();
        const response = await fetch(`${API_BASE}/ibans/${deletingId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('Başarılı', result.message, 'success');
            closeDeleteModal();
            loadIbans();
        } else {
            showToast('Hata', result.error, 'error');
        }
    } catch (error) {
        showToast('Hata', 'IBAN silinirken bir hata oluştu', 'error');
        console.error('Error deleting IBAN:', error);
    } finally {
        hideLoading();
    }
}

// IBAN kopyala
async function copyIban(ibanNumber) {
    try {
        await navigator.clipboard.writeText(ibanNumber);
        showToast('Başarılı', 'IBAN panoya kopyalandı', 'success');
    } catch (error) {
        // Fallback için geçici input oluştur
        const tempInput = document.createElement('input');
        tempInput.value = ibanNumber;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('Başarılı', 'IBAN panoya kopyalandı', 'success');
    }
}

// Arama işlemi
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        renderIbans();
        return;
    }
    
    const filteredIbans = ibans.filter(iban => 
        iban.iban_number.toLowerCase().includes(searchTerm) ||
        iban.bank_name.toLowerCase().includes(searchTerm) ||
        iban.account_holder.toLowerCase().includes(searchTerm) ||
        (iban.description && iban.description.toLowerCase().includes(searchTerm))
    );
    
    renderIbans(filteredIbans);
}

// IBAN doğrulama (input event)
async function validateIbanInput(e) {
    const input = e.target;
    let iban = input.value;
    const validationDiv = document.getElementById('ibanValidation');
    
    // TR otomatik ekleme ve formatla
    const formattedIban = formatIbanInput(iban);
    
    // Cursor pozisyonunu koru
    const cursorPos = input.selectionStart;
    const oldLength = iban.length;
    
    input.value = formattedIban;
    
    // Cursor pozisyonunu ayarla
    const newLength = formattedIban.length;
    const lengthDiff = newLength - oldLength;
    input.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
    
    if (!formattedIban.trim() || formattedIban === 'TR') {
        validationDiv.textContent = '';
        validationDiv.className = 'validation-message';
        return;
    }
    
    const isValid = await validateIban(formattedIban);
    
    if (isValid) {
        validationDiv.textContent = '✓ Geçerli IBAN numarası';
        validationDiv.className = 'validation-message valid';
    } else {
        validationDiv.textContent = '✗ Geçersiz IBAN numarası';
        validationDiv.className = 'validation-message invalid';
    }
}

// Edit IBAN doğrulama (input event)
async function validateEditIbanInput(e) {
    const input = e.target;
    let iban = input.value;
    const validationDiv = document.getElementById('editIbanValidation');
    
    // TR otomatik ekleme ve formatla
    const formattedIban = formatIbanInput(iban);
    
    // Cursor pozisyonunu koru
    const cursorPos = input.selectionStart;
    const oldLength = iban.length;
    
    input.value = formattedIban;
    
    // Cursor pozisyonunu ayarla
    const newLength = formattedIban.length;
    const lengthDiff = newLength - oldLength;
    input.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
    
    if (!formattedIban.trim() || formattedIban === 'TR') {
        validationDiv.textContent = '';
        validationDiv.className = 'validation-message';
        return;
    }
    
    const isValid = await validateIban(formattedIban);
    
    if (isValid) {
        validationDiv.textContent = '✓ Geçerli IBAN numarası';
        validationDiv.className = 'validation-message valid';
    } else {
        validationDiv.textContent = '✗ Geçersiz IBAN numarası';
        validationDiv.className = 'validation-message invalid';
    }
}

// IBAN doğrulama API çağrısı
async function validateIban(iban) {
    try {
        const response = await fetch(`${API_BASE}/ibans/validate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ iban_number: iban })
        });
        
        const result = await response.json();
        return result.success && result.data.is_valid;
    } catch (error) {
        console.error('Error validating IBAN:', error);
        return false;
    }
}

// IBAN formatla
function formatIban(iban) {
    // Boşlukları temizle ve 4'er karakter grupları halinde formatla
    const cleanIban = iban.replace(/\s/g, '');
    return cleanIban.replace(/(.{4})/g, '$1 ').trim();
}

// Form sıfırla
function resetForm() {
    ibanForm.reset();
    document.getElementById('ibanValidation').textContent = '';
    document.getElementById('ibanValidation').className = 'validation-message';
}

// Modal'ları kapat
function closeEditModal() {
    editModal.classList.remove('show');
    editingId = null;
    editForm.reset();
    document.getElementById('editIbanValidation').textContent = '';
    document.getElementById('editIbanValidation').className = 'validation-message';
}

function closeDeleteModal() {
    deleteModal.classList.remove('show');
    deletingId = null;
}

// Loading göster/gizle
function showLoading() {
    loadingOverlay.classList.add('show');
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
}

// Toast bildirimi göster
function showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-header">
            <span class="toast-title">${title}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // 5 saniye sonra otomatik kapat
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// IBAN input formatla (TR otomatik ekleme + 4'lü gruplar)
function formatIbanInput(value) {
    // Sadece harf ve rakamları al, boşlukları kaldır
    let cleanValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Eğer boşsa veya TR ile başlamıyorsa TR ekle
    if (!cleanValue) {
        return 'TR';
    }
    
    if (!cleanValue.startsWith('TR')) {
        // Eğer ilk karakter rakam ise TR ekle
        if (/^\d/.test(cleanValue)) {
            cleanValue = 'TR' + cleanValue;
        } else if (cleanValue.startsWith('T') && cleanValue.length === 1) {
            cleanValue = 'TR';
        } else if (cleanValue.startsWith('T') && !cleanValue.startsWith('TR')) {
            cleanValue = 'TR' + cleanValue.substring(1);
        } else if (!cleanValue.startsWith('T')) {
            cleanValue = 'TR' + cleanValue;
        }
    }
    
    // IBAN maksimum uzunluğu (Türkiye için 26 karakter)
    cleanValue = cleanValue.substring(0, 26);
    
    // 4'lü gruplar halinde formatla
    const formatted = cleanValue.replace(/(.{4})/g, '$1 ').trim();
    
    return formatted;
}

// Service Worker kaydı (PWA için)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker kaydı başarılı: ', registration.scope);
            })
            .catch(function(error) {
                console.log('ServiceWorker kaydı başarısız: ', error);
            });
    });
}


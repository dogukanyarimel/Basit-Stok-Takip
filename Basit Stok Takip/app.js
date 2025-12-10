// Sayfa yüklendiğinde çalışması için 'DOMContentLoaded' olayı dinlenir
document.addEventListener('DOMContentLoaded', function() {

    // 1. Gerekli HTML elementlerini seçme
    const stokFormu = document.getElementById('stok-formu');
    const tabloGovdesi = document.getElementById('tablo-govdesi');
    const toplamDegerSpan = document.getElementById('toplam-deger');

    // localStorage için anahtar (key)
    const DEPOLAMA_ANAHTARI = 'stokEnvanteri';

    // 2. Envanter dizisini localStorage'dan yükle
    // Eğer localStorage boşsa, boş bir dizi kullan
    let envanter = JSON.parse(localStorage.getItem(DEPOLAMA_ANAHTARI)) || [];

    // 3. (YENİ) Veriyi localStorage'a kaydeden fonksiyon
    function veriyiKaydet() {
        localStorage.setItem(DEPOLAMA_ANAHTARI, JSON.stringify(envanter));
    }

    // 4. (YENİ) Tabloya tıklama olayını dinle (Sil butonları için)
    // 'click' olayını direkt tablo gövdesine ekliyoruz (Event Delegation)
    tabloGovdesi.addEventListener('click', function(e) {

        // Tıklanan elementin 'sil-btn' class'ına sahip olup olmadığını kontrol et
        if (e.target.classList.contains('sil-btn')) {
            // Butonun 'data-id' attribute'undan silinecek ID'yi al
            const silinecekId = e.target.getAttribute('data-id');

            // 5. Envanter dizisini 'filter' ile güncelle
            // ID'si eşleşmeyenleri tut, eşleşeni diziden çıkar
            envanter = envanter.filter(function(malzeme) {
                return malzeme.id !== silinecekId;
            });

            // 6. Değişiklikleri localStorage'a kaydet
            veriyiKaydet();

            // 7. Tabloyu yeniden çiz
            raporuGuncelle();
        }
    });


    // 8. Form gönderildiğinde (submit) çalışacak fonksiyon
    stokFormu.addEventListener('submit', function(e) {
        e.preventDefault();

        const malzemeAdi = document.getElementById('malzeme-adi').value;
        const adet = parseFloat(document.getElementById('malzeme-adet').value);
        const fiyat = parseFloat(document.getElementById('malzeme-fiyat').value);

        if (malzemeAdi && adet > 0 && fiyat >= 0) {

            const yeniMalzeme = {
                // (YENİ) Her malzeme için benzersiz bir ID oluşturuyoruz
                // Bu, silme işlemi için gereklidir.
                id: Date.now().toString(),
                ad: malzemeAdi,
                adet: adet,
                fiyat: fiyat
            };

            envanter.push(yeniMalzeme);

            // (YENİ) Ekleme yaptıktan sonra hemen kaydet
            veriyiKaydet();

            raporuGuncelle();
            stokFormu.reset();

        } else {
            alert('Lütfen tüm alanları doğru girdiğinizden emin olun.');
        }
    });

    // 9. Raporu ve toplam tutarı güncelleyen ana fonksiyon
    function raporuGuncelle() {

        tabloGovdesi.innerHTML = '';
        let genelToplamTutar = 0;

        envanter.forEach(function(malzeme) {

            const toplamTutar = malzeme.adet * malzeme.fiyat;
            genelToplamTutar += toplamTutar;

            const yeniSatir = document.createElement('tr');

            // (!!! ÖNEMLİ GÜNCELLEME BURADA !!!)
            // Butonun class'ını Bootstrap class'ları ile değiştirdik
            yeniSatir.innerHTML = `
                <td>${malzeme.ad}</td>
                <td>${malzeme.adet}</td>
                <td>${malzeme.fiyat.toFixed(2)} TL</td>
                <td>${toplamTutar.toFixed(2)} TL</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm sil-btn" data-id="${malzeme.id}">Sil</button>
                </td>
            `;

            tabloGovdesi.appendChild(yeniSatir);
        });

        toplamDegerSpan.textContent = `${genelToplamTutar.toFixed(2)} TL`;
    }

    // 10. (YENİ) Sayfa ilk yüklendiğinde
    // localStorage'dan alınan verilerle tabloyu doldur
    raporuGuncelle();

});
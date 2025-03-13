import Ionicons from "react-native-vector-icons/Ionicons";


export interface KategoriItem {
    key: string;
    title: string;
    kategoriIcon: string;
    vendor: React.ComponentType<Ionicons>;
}

export interface GroupedIcons {
    [category: string]: KategoriItem[];
}

export const groupedIcons: GroupedIcons = {
    Hiburan: [
        { key: "2", title: "Game", kategoriIcon: 'game-controller-outline', vendor: Ionicons },
        { key: "8", title: "Hiburan", kategoriIcon: 'tv-outline', vendor: Ionicons },
        { key: "21", title: "Musik", kategoriIcon: 'musical-notes-outline', vendor: Ionicons },
        { key: "22", title: "Foto", kategoriIcon: 'camera-outline', vendor: Ionicons },
        { key: "28", title: "Film", kategoriIcon: 'film-outline', vendor: Ionicons },
        { key: "38", title: "Seni", kategoriIcon: 'color-palette-outline', vendor: Ionicons },
        { key: "41", title: "Konser", kategoriIcon: 'volume-high-outline', vendor: Ionicons },
        { key: "42", title: "Teater", kategoriIcon: 'people-outline', vendor: Ionicons }
    ],
    Makanan: [
        { key: "1", title: "Makanan", kategoriIcon: 'fast-food-outline', vendor: Ionicons },
        { key: "15", title: "Cepat Saji", kategoriIcon: 'pizza-outline', vendor: Ionicons },
        { key: "16", title: "Minuman", kategoriIcon: 'wine-outline', vendor: Ionicons },
        { key: "25", title: "Dapur", kategoriIcon: 'cafe-outline', vendor: Ionicons },
        { key: "34", title: "Teh", kategoriIcon: 'beer-outline', vendor: Ionicons },
        { key: "40", title: "Kopi", kategoriIcon: 'cafe-outline', vendor: Ionicons },
        { key: "43", title: "Cemilan", kategoriIcon: 'ice-cream-outline', vendor: Ionicons },
        { key: "44", title: "Restoran", kategoriIcon: 'restaurant-outline', vendor: Ionicons }
    ],
    Belanja: [
        { key: "3", title: "Belanja", kategoriIcon: 'cart-outline', vendor: Ionicons },
        { key: "18", title: "Fesyen", kategoriIcon: 'shirt-outline', vendor: Ionicons },
        { key: "23", title: "Kosmetik", kategoriIcon: 'flower-outline', vendor: Ionicons },
        { key: "45", title: "Perhiasan", kategoriIcon: 'diamond-outline', vendor: Ionicons },
        { key: "46", title: "Aksesoris", kategoriIcon: 'glasses-outline', vendor: Ionicons },
        { key: "47", title: "Mall", kategoriIcon: 'bag-outline', vendor: Ionicons }
    ],
    Kehidupan: [
        { key: "17", title: "Rumah", kategoriIcon: 'home-outline', vendor: Ionicons },
        { key: "19", title: "Hewan", kategoriIcon: 'paw-outline', vendor: Ionicons },
        { key: "24", title: "Tubuh", kategoriIcon: 'heart-outline', vendor: Ionicons },
        { key: "33", title: "Listrik", kategoriIcon: 'flash-outline', vendor: Ionicons },
        { key: "48", title: "Taman", kategoriIcon: 'flower-outline', vendor: Ionicons },
        { key: "49", title: "Kebersihan", kategoriIcon: 'leaf-outline', vendor: Ionicons }
    ],
    Pribadi: [
        { key: "30", title: "Chat", kategoriIcon: 'chatbubble-outline', vendor: Ionicons },
        { key: "31", title: "Kunci", kategoriIcon: 'key-outline', vendor: Ionicons },
        { key: "32", title: "Jam", kategoriIcon: 'watch-outline', vendor: Ionicons },
        { key: "50", title: "Hobi", kategoriIcon: 'brush-outline', vendor: Ionicons },
        { key: "51", title: "Meditasi", kategoriIcon: 'leaf-outline', vendor: Ionicons }
    ],
    Pendidikan: [
        { key: "9", title: "Edukasi", kategoriIcon: 'school-outline', vendor: Ionicons },
        { key: "26", title: "Buku", kategoriIcon: 'book-outline', vendor: Ionicons },
        { key: "52", title: "Kursus", kategoriIcon: 'laptop-outline', vendor: Ionicons },
        { key: "53", title: "Workshop", kategoriIcon: 'briefcase-outline', vendor: Ionicons }
    ],
    Festival: [
        { key: "20", title: "Hadiah", kategoriIcon: 'gift-outline', vendor: Ionicons },
        { key: "54", title: "Pesta", kategoriIcon: 'balloon-outline', vendor: Ionicons },
        { key: "55", title: "Tahun Baru", kategoriIcon: 'sparkles-outline', vendor: Ionicons }
    ],
    Olahraga: [
        { key: "7", title: "Olahraga", kategoriIcon: 'bicycle-outline', vendor: Ionicons },
        { key: "56", title: "Sepak Bola", kategoriIcon: 'football-outline', vendor: Ionicons },
        { key: "57", title: "Basket", kategoriIcon: 'basketball-outline', vendor: Ionicons },
        { key: "58", title: "Lari", kategoriIcon: 'walk-outline', vendor: Ionicons }
    ],
    Kantor: [
        { key: "10", title: "Kerja", kategoriIcon: 'briefcase-outline', vendor: Ionicons },
        { key: "59", title: "Meeting", kategoriIcon: 'people-outline', vendor: Ionicons },
        { key: "60", title: "Laptop", kategoriIcon: 'laptop-outline', vendor: Ionicons }
    ],
    Transportasi: [
        { key: "4", title: "Transportasi", kategoriIcon: 'bus-outline', vendor: Ionicons },
        { key: "27", title: "Mobil", kategoriIcon: 'car-outline', vendor: Ionicons },
        { key: "61", title: "Motor", kategoriIcon: 'bicycle-outline', vendor: Ionicons },
        { key: "62", title: "Kereta", kategoriIcon: 'train-outline', vendor: Ionicons }
    ],
    Kesehatan: [
        { key: "6", title: "Kesehatan", kategoriIcon: 'medkit-outline', vendor: Ionicons },
        { key: "63", title: "Obat", kategoriIcon: 'thermometer-outline', vendor: Ionicons },
        { key: "64", title: "Dokter", kategoriIcon: 'medical-outline', vendor: Ionicons }
    ],
    Berpergian: [
        { key: "5", title: "Travel", kategoriIcon: 'airplane-outline', vendor: Ionicons },
        { key: "14", title: "Wisata", kategoriIcon: 'map-outline', vendor: Ionicons },
        { key: "29", title: "Langit", kategoriIcon: 'cloud-outline', vendor: Ionicons },
        { key: "35", title: "Pohon", kategoriIcon: 'leaf-outline', vendor: Ionicons },
        { key: "36", title: "Pantai", kategoriIcon: 'water-outline', vendor: Ionicons },
        { key: "37", title: "Hujan", kategoriIcon: 'rainy-outline', vendor: Ionicons }
    ],
    Keuangan: [
        { key: "12", title: "Uang", kategoriIcon: 'wallet-outline', vendor: Ionicons },
        { key: "13", title: "Investasi", kategoriIcon: 'trending-up-outline', vendor: Ionicons },
        { key: "65", title: "Pinjaman", kategoriIcon: 'cash-outline', vendor: Ionicons },
        { key: "66", title: "Asuransi", kategoriIcon: 'shield-checkmark-outline', vendor: Ionicons }
    ],
    LainLain: [
        { key: "11", title: "Gadget", kategoriIcon: 'phone-portrait-outline', vendor: Ionicons },
        { key: "39", title: "Alat", kategoriIcon: 'construct-outline', vendor: Ionicons },
        { key: "67", title: "Keamanan", kategoriIcon: 'lock-closed-outline', vendor: Ionicons }
    ]
};

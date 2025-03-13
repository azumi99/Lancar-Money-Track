import Ionicons from "react-native-vector-icons/Ionicons";

export interface KategoriItem {
    title: string;
    kategoriIcon: string;
    vendor: React.ComponentType<any>;
    key?: string;
}
const dataIcon: KategoriItem[] = [
    { key: "1", title: "Makanan", kategoriIcon: 'fast-food-outline', vendor: Ionicons },
    { key: "2", title: "Game", kategoriIcon: 'game-controller-outline', vendor: Ionicons },
    { key: "3", title: "Belanja", kategoriIcon: 'cart-outline', vendor: Ionicons },
    { key: "4", title: "Transportasi", kategoriIcon: 'bus-outline', vendor: Ionicons },
    { key: "5", title: "Travel", kategoriIcon: 'airplane-outline', vendor: Ionicons },
    { key: "6", title: "Kesehatan", kategoriIcon: 'medkit-outline', vendor: Ionicons },
    { key: "7", title: "Olahraga", kategoriIcon: 'bicycle-outline', vendor: Ionicons },
    { key: "8", title: "Hiburan", kategoriIcon: 'tv-outline', vendor: Ionicons },
    { key: "9", title: "Edukasi", kategoriIcon: 'school-outline', vendor: Ionicons },
    { key: "10", title: "Kerja", kategoriIcon: 'briefcase-outline', vendor: Ionicons },
    { key: "11", title: "Gadget", kategoriIcon: 'phone-portrait-outline', vendor: Ionicons },
    { key: "12", title: "Uang", kategoriIcon: 'wallet-outline', vendor: Ionicons },
    { key: "13", title: "Investasi", kategoriIcon: 'trending-up-outline', vendor: Ionicons },
    { key: "14", title: "Wisata", kategoriIcon: 'map-outline', vendor: Ionicons },
    { key: "15", title: "Cepat", kategoriIcon: 'pizza-outline', vendor: Ionicons },
    { key: "16", title: "Minuman", kategoriIcon: 'wine-outline', vendor: Ionicons },
    { key: "17", title: "Rumah", kategoriIcon: 'home-outline', vendor: Ionicons },
    { key: "18", title: "Fesyen", kategoriIcon: 'shirt-outline', vendor: Ionicons },
    { key: "19", title: "Hewan", kategoriIcon: 'paw-outline', vendor: Ionicons },
    { key: "20", title: "Hadiah", kategoriIcon: 'gift-outline', vendor: Ionicons },
    { key: "21", title: "Musik", kategoriIcon: 'musical-notes-outline', vendor: Ionicons },
    { key: "22", title: "Foto", kategoriIcon: 'camera-outline', vendor: Ionicons },
    { key: "23", title: "Kosmetik", kategoriIcon: 'flower-outline', vendor: Ionicons },
    { key: "24", title: "Tubuh", kategoriIcon: 'heart-outline', vendor: Ionicons },
    { key: "25", title: "Dapur", kategoriIcon: 'cafe-outline', vendor: Ionicons },
    { key: "26", title: "Buku", kategoriIcon: 'book-outline', vendor: Ionicons },
    { key: "27", title: "Mobil", kategoriIcon: 'car-outline', vendor: Ionicons },
    { key: "28", title: "Film", kategoriIcon: 'film-outline', vendor: Ionicons },
    { key: "29", title: "Langit", kategoriIcon: 'cloud-outline', vendor: Ionicons },
    { key: "30", title: "Chat", kategoriIcon: 'chatbubble-outline', vendor: Ionicons },
    { key: "31", title: "Kunci", kategoriIcon: 'key-outline', vendor: Ionicons },
    { key: "32", title: "Jam", kategoriIcon: 'watch-outline', vendor: Ionicons },
    { key: "33", title: "Listrik", kategoriIcon: 'flash-outline', vendor: Ionicons },
    { key: "34", title: "Teh", kategoriIcon: 'beer-outline', vendor: Ionicons },
    { key: "35", title: "Pohon", kategoriIcon: 'leaf-outline', vendor: Ionicons },
    { key: "36", title: "Pantai", kategoriIcon: 'water-outline', vendor: Ionicons },
    { key: "37", title: "Hujan", kategoriIcon: 'rainy-outline', vendor: Ionicons },
    { key: "38", title: "Seni", kategoriIcon: 'color-palette-outline', vendor: Ionicons },
    { key: "39", title: "Alat", kategoriIcon: 'construct-outline', vendor: Ionicons },
    { key: "40", title: "Kopi", kategoriIcon: 'cafe-outline', vendor: Ionicons }
];

const dataPemasukan: KategoriItem[] = [
    { key: "1", title: "Gaji", kategoriIcon: 'cash-outline', vendor: Ionicons },
    { key: "2", title: "Bonus", kategoriIcon: 'gift-outline', vendor: Ionicons },
    { key: "3", title: "Investasi", kategoriIcon: 'trending-up-outline', vendor: Ionicons },
    { key: "4", title: "Hadiah", kategoriIcon: 'medal-outline', vendor: Ionicons },
    { key: "5", title: "Proyek", kategoriIcon: 'briefcase-outline', vendor: Ionicons },
    { key: "6", title: "Usaha", kategoriIcon: 'business-outline', vendor: Ionicons },
    { key: "7", title: "Tabungan", kategoriIcon: 'save-outline', vendor: Ionicons }
];


export { dataPemasukan, dataIcon }
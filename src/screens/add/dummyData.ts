import Ionicons from "react-native-vector-icons/Ionicons";

export interface KategoriItem {
    title?: string;
    kategoriIcon?: string;
    vendor?: React.ComponentType<any>;
}
const dataIcon: KategoriItem[] = [
    { title: "Makanan", kategoriIcon: 'fast-food-outline', vendor: Ionicons },
    { title: "Game", kategoriIcon: 'game-controller-outline', vendor: Ionicons },
    { title: "Belanja", kategoriIcon: 'cart-outline', vendor: Ionicons },
    { title: "Transportasi", kategoriIcon: 'bus-outline', vendor: Ionicons },
    { title: "Travel", kategoriIcon: 'airplane-outline', vendor: Ionicons },
    { title: "Kesehatan", kategoriIcon: 'medkit-outline', vendor: Ionicons },
    { title: "Olahraga", kategoriIcon: 'bicycle-outline', vendor: Ionicons },
    { title: "Hiburan", kategoriIcon: 'tv-outline', vendor: Ionicons },
    { title: "Edukasi", kategoriIcon: 'school-outline', vendor: Ionicons },
    { title: "Kerja", kategoriIcon: 'briefcase-outline', vendor: Ionicons },
    { title: "Gadget", kategoriIcon: 'phone-portrait-outline', vendor: Ionicons },
    { title: "Uang", kategoriIcon: 'wallet-outline', vendor: Ionicons },
    { title: "Investasi", kategoriIcon: 'trending-up-outline', vendor: Ionicons },
    { title: "Wisata", kategoriIcon: 'map-outline', vendor: Ionicons },
    { title: "Cepat", kategoriIcon: 'pizza-outline', vendor: Ionicons },
    { title: "Minuman", kategoriIcon: 'wine-outline', vendor: Ionicons },
    { title: "Rumah", kategoriIcon: 'home-outline', vendor: Ionicons },
    { title: "Fesyen", kategoriIcon: 'shirt-outline', vendor: Ionicons },
    { title: "Hewan", kategoriIcon: 'paw-outline', vendor: Ionicons },
    { title: "Hadiah", kategoriIcon: 'gift-outline', vendor: Ionicons },
    { title: "Musik", kategoriIcon: 'musical-notes-outline', vendor: Ionicons },
    { title: "Foto", kategoriIcon: 'camera-outline', vendor: Ionicons },
    { title: "Kosmetik", kategoriIcon: 'flower-outline', vendor: Ionicons },
    { title: "Tubuh", kategoriIcon: 'heart-outline', vendor: Ionicons },
    { title: "Dapur", kategoriIcon: 'cafe-outline', vendor: Ionicons },
    { title: "Buku", kategoriIcon: 'book-outline', vendor: Ionicons },
    { title: "Mobil", kategoriIcon: 'car-outline', vendor: Ionicons },
    { title: "Film", kategoriIcon: 'film-outline', vendor: Ionicons },
    { title: "Langit", kategoriIcon: 'cloud-outline', vendor: Ionicons },
    { title: "Chat", kategoriIcon: 'chatbubble-outline', vendor: Ionicons },
    { title: "Kunci", kategoriIcon: 'key-outline', vendor: Ionicons },
    { title: "Jam", kategoriIcon: 'watch-outline', vendor: Ionicons },
    { title: "Listrik", kategoriIcon: 'flash-outline', vendor: Ionicons },
    { title: "Teh", kategoriIcon: 'beer-outline', vendor: Ionicons },
    { title: "Pohon", kategoriIcon: 'leaf-outline', vendor: Ionicons },
    { title: "Pantai", kategoriIcon: 'water-outline', vendor: Ionicons },
    { title: "Hujan", kategoriIcon: 'rainy-outline', vendor: Ionicons },
    { title: "Seni", kategoriIcon: 'color-palette-outline', vendor: Ionicons },
    { title: "Alat", kategoriIcon: 'construct-outline', vendor: Ionicons },
    { title: "Kopi", kategoriIcon: 'cafe-outline', vendor: Ionicons }
];

const dataPemasukan: KategoriItem[] = [
    { title: "Gaji", kategoriIcon: 'cash-outline', vendor: Ionicons },
    { title: "Bonus", kategoriIcon: 'gift-outline', vendor: Ionicons },
    { title: "Investasi", kategoriIcon: 'trending-up-outline', vendor: Ionicons },
    { title: "Hadiah", kategoriIcon: 'medal-outline', vendor: Ionicons },
    { title: "Proyek", kategoriIcon: 'briefcase-outline', vendor: Ionicons },
    { title: "Usaha", kategoriIcon: 'business-outline', vendor: Ionicons },
    { title: "Tabungan", kategoriIcon: 'save-outline', vendor: Ionicons }
];

export { dataPemasukan, dataIcon }
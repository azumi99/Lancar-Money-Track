import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrencyItemInterface } from '@screens/profile/detailPengaturan/pengaturanCurrency/currencyScreen';
import { KategoriInterface } from '@screens/profile/detailPengaturan/pengaturanKategori/modelKategori';
import { RekeningInterface } from '@screens/profile/detailPengaturan/pengaturanRekening/modelRekening';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface JwtState {
  token: string;
  setToken: (token: string) => void;
}

const TokenJwt = create<JwtState>()(
  persist(
    set => ({
      token: '',
      setToken: (newToken: string) => set({ token: newToken }),
    }),
    {
      name: 'jwttoken',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
export interface UserData {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}


interface UserState {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
}

const UserStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      setUser: (userData: UserData | null) => set({ user: userData }),
    }),
    {
      name: 'user-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export interface temaData {
  id?: number;
  nama_tema?: string;
  deskripsi?: string;
  icon_name?: string;
}

interface temaDataStore {
  tema: temaData[];
  setTema: (dataTema: any) => void;
}
const TemaStore = create<temaDataStore>()(
  persist(
    set => ({
      tema: [],
      setTema: (dataTema: temaData[]) => set({ tema: dataTema }),
    }),
    {
      name: 'tema-data',
      storage: createJSONStorage(() => AsyncStorage),
    },
  )
);

interface DarkModeInterface {
  mode: boolean;
  setMode: (mode: boolean) => void;
}

const DarkModeStore = create<DarkModeInterface>()(
  persist(
    set => ({
      mode: false,
      setMode: (newToken: boolean) => set({ mode: newToken }),
    }),
    {
      name: 'mode',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

interface EditProfileInterface {
  param: boolean;
  setParam: (param: boolean) => void;
}

const EditProfileStore = create<EditProfileInterface>()(set => ({
  param: false,
  setParam: (value: boolean) => set({ param: value }),
}));

interface ModalDateInterface {
  modalDate: boolean;
  setModalDate: (param: boolean) => void;
}

const ModalDate = create<ModalDateInterface>()(set => ({
  modalDate: false,
  setModalDate: (value: boolean) => set({ modalDate: value }),
}));

interface DefaultDateInterface {
  date: string;
  setDate: (param: string) => void;
}

const DefaultDate = create<DefaultDateInterface>()(set => ({
  date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'short' }),
  setDate: (value: string) => set({ date: value }),
}));

interface ChangePasswordInterface {
  change: boolean;
  setChange: (param: boolean) => void;
}

const ChangePasswordStore = create<ChangePasswordInterface>()(set => ({
  change: false,
  setChange: (value: boolean) => set({ change: value }),
}));

interface EditActionInterface {
  edit: boolean;
  setEdit: (value: boolean) => void;
}

const ActionEditStore = create<EditActionInterface>()(set => ({
  edit: false,
  setEdit: (value: boolean) => set({ edit: value }),
}));

interface addAccountInterface {
  add: boolean;
  setAdd: (value: boolean) => void;
}

const AddAccountStore = create<addAccountInterface>()(set => ({
  add: false,
  setAdd: (value: boolean) => set({ add: value }),
}));

interface padViewInterface {
  pad: boolean;
  setPad: (value: boolean) => void;
}

const PadStore = create<padViewInterface>()(set => ({
  pad: false,
  setPad: (value: boolean) => set({ pad: value }),
}));

interface navigateIdRequestInterface {
  idNav: number;
  setIdNav: (value: number) => void;
}

const navigateIdRequestStore = create<navigateIdRequestInterface>()(set => ({
  idNav: 0,
  setIdNav: (value: number) => set({ idNav: value }),
}));


interface FcmInterface {
  fcmtoken: string;
  setFcmtoken: (value: string) => void;
}
const TokenFCMStore = create<FcmInterface>()(set => ({
  fcmtoken: '',
  setFcmtoken: (value: string) => set({ fcmtoken: value }),
}));
const MessageStore = create<any>()(set => ({
  messageData: '',
  setMessageData: (value: any) => set({ messageData: value }),
}));
interface NotifInterface {
  notif: string;
  setNotif: (value: string) => void;
}
const NotifStore = create<NotifInterface>()(set => ({
  notif: '',
  setNotif: (value: string) => set({ notif: value }),
}));
interface DateCalenderInterface {
  titleDate: string;
  setTitleDate: (value: string) => void;
}
const DateCalenderDetail = create<DateCalenderInterface>()(set => ({
  titleDate: '',
  setTitleDate: (value: string) => set({ titleDate: value }),
}));
interface SaveKategoriInterface {
  saveKategori: boolean;
  setSaveKategori: (value: boolean) => void;
}
const SaveKategori = create<SaveKategoriInterface>()(set => ({
  saveKategori: false,
  setSaveKategori: (value: boolean) => set({ saveKategori: value }),
}));

interface KategoriState {
  kategori: KategoriInterface[];
  setKategori: (newData: KategoriInterface[]) => void;
}

const useKategoriStorePemasukan = create<KategoriState>()(
  persist(
    set => ({
      kategori: [],
      setKategori: (newData) => set({ kategori: newData }),
    }),
    {
      name: 'kategori-storage-pemasukan',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
const useKategoriStorePengeluaran = create<KategoriState>()(
  persist(
    set => ({
      kategori: [],
      setKategori: (newData) => set({ kategori: newData }),
    }),
    {
      name: 'kategori-storage-pengeluaran',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
interface RekeningState {
  rekening: RekeningInterface[];
  setRekening: (newData: RekeningInterface[]) => void;
}
const useRekeningData = create<RekeningState>()(
  persist(
    set => ({
      rekening: [],
      setRekening: (newData) => set({ rekening: newData }),
    }),
    {
      name: 'rekening-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

interface hookRekeningInterface {
  saveRekening: boolean;
  setSaveRekening: (value: boolean) => void;
}
const useHockRekening = create<hookRekeningInterface>()(set => ({
  saveRekening: false,
  setSaveRekening: (value: boolean) => set({ saveRekening: value }),
}));

interface CurrencyState {
  currency: CurrencyItemInterface[];
  setCurrency: (newData: CurrencyItemInterface[]) => void;

}
const useCurrency = create<CurrencyState>()(
  persist(
    set => ({
      currency: [],
      setCurrency: (newData) => set({ currency: newData }),
    }),
    {
      name: 'currency-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
interface HookInterfaceCurrency {
  selectedCurrency: string;
  setSelectedCurrency: (newData: string) => void;
}

const useHookDataCurrency = create<HookInterfaceCurrency>()(
  set => ({
    selectedCurrency: "",
    setSelectedCurrency: (newData) => set({ selectedCurrency: newData }),
  })
);

interface searchCurrencyInterface {
  currencySearch: boolean;
  setCurrencySearch: (value: boolean) => void;
}
const useCurrencySearch = create<searchCurrencyInterface>()(set => ({
  currencySearch: false,
  setCurrencySearch: (value: boolean) => set({ currencySearch: value }),
}));

interface actionInterfaceCurrency {
  handleOpen: boolean;
  setHandleOpen: (value: boolean) => void;
}
const useHookActionCurrency = create<actionInterfaceCurrency>()(set => ({
  handleOpen: false,
  setHandleOpen: (value: boolean) => set({ handleOpen: value }),
}));

interface InterfaceDefaultOpenRek {
  defaultHandle: boolean;
  setHandleDefault: (value: boolean) => void;

}
const useDefaultOpenRek = create<InterfaceDefaultOpenRek>()(set => ({
  defaultHandle: false,
  setHandleDefault: (value: boolean) => set({ defaultHandle: value }),
}));

interface interfaceSelectKategori {
  selectedIndex: string;
  setSelectedIndex: (value: string) => void;

}
const useSelectedKategori = create<interfaceSelectKategori>()(set => ({
  selectedIndex: '',
  setSelectedIndex: (value: string) => set({ selectedIndex: value }),
}));


type RekeningTransferStore = {
  selectedRekeningFrom: number | undefined;
  selectedRekeningTo: number | undefined;
  setSelectedRekeningFrom: (value: number | undefined) => void;
  setSelectedRekeningTo: (value: number | undefined) => void;
  resetRekeningTransfer: () => void;
};

const useRekeningTransferStore = create<RekeningTransferStore>((set) => ({
  selectedRekeningFrom: undefined,
  selectedRekeningTo: undefined,
  setSelectedRekeningFrom: (value) => set({ selectedRekeningFrom: value }),
  setSelectedRekeningTo: (value) => set({ selectedRekeningTo: value }),
  resetRekeningTransfer: () => set({ selectedRekeningFrom: undefined, selectedRekeningTo: undefined }),
}));

interface SuaraState {
  suara: boolean;
  setSuara: (val: boolean) => void;
}
const SuaraOnOff = create<SuaraState>((set) => ({
  suara: false,
  setSuara: (val) => set({ suara: val }),
}));

interface TanggalMulaiInterface {
  tanggal: string;
  setTanggal: (val: string) => void;
}
const useTanggalMulai = create<TanggalMulaiInterface>()(
  persist(
    set => ({
      tanggal: "1",
      setTanggal: (val) => set({ tanggal: val }),
    }),
    {
      name: 'tanggal-awal',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);




export {
  TokenJwt,
  UserStore,
  DarkModeStore,
  ActionEditStore,
  EditProfileStore,
  navigateIdRequestStore,
  ChangePasswordStore,
  AddAccountStore,
  MessageStore,
  TokenFCMStore,
  NotifStore,
  TemaStore,
  DefaultDate,
  ModalDate,
  PadStore,
  DateCalenderDetail,
  SaveKategori,
  useKategoriStorePemasukan,
  useKategoriStorePengeluaran,
  useRekeningData,
  useCurrency,
  useCurrencySearch,
  useHookActionCurrency,
  useHockRekening,
  useDefaultOpenRek,
  useHookDataCurrency,
  useSelectedKategori,
  SuaraOnOff,
  useRekeningTransferStore,
  useTanggalMulai
};

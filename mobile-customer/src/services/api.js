const API = 'http://10.0.2.2:4000'; // android emulator; replace with your machine ip if testing on device
export const fetchMenu = async () => {
  const r = await fetch(`${API}/menu`);
  return r.json();
};

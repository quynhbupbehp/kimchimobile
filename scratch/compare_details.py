import json
import zipfile
import xml.etree.ElementTree as ET
import os

def parse_xlsx(path):
    with zipfile.ZipFile(path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('.//ns:si', ns):
                texts = [t.text or '' for t in si.findall('.//ns:t', ns)]
                shared_strings.append(''.join(texts))
        
        sheet_tree = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        rows = []
        for row_el in sheet_tree.findall('.//ns:row', ns):
            row_data = {}
            for c in row_el.findall('ns:c', ns):
                ref = c.attrib.get('r', '')
                t = c.attrib.get('t', '')
                v_el = c.find('ns:v', ns)
                val = v_el.text if v_el is not None else ''
                if t == 's' and val.isdigit():
                    idx = int(val)
                    if idx < len(shared_strings):
                        val = shared_strings[idx]
                col_letters = ''.join([ch for ch in ref if ch.isalpha()])
                row_data[col_letters] = val
            rows.append(row_data)
        
        if not rows:
            return []
        data_rows = []
        for r in rows[1:]:
            if not any(r.values()):
                continue
            data_rows.append(r)
        return data_rows

folder = r'C:\Users\quynhbupbehp\Desktop\TAB BÁN MÁY'
con_hang = parse_xlsx(os.path.join(folder, 'Còn Hàng.xlsx'))
chua_xu_ly = parse_xlsx(os.path.join(folder, 'Chưa xử lý.xlsx'))
da_ban = parse_xlsx(os.path.join(folder, 'Đã Bán  ( Bảo Hành).xlsx'))

# Load seed_data.js
with open('js/seed_data.js', 'r', encoding='utf-8') as f:
    code = f.read()

# Extract json
import re
m1 = re.search(r'window\.SEED_PHONES_DATA\s*=\s*(\[.*?\]);', code, re.DOTALL)
m2 = re.search(r'window\.SEED_SOLD_DATA\s*=\s*(\[.*?\]);', code, re.DOTALL)

seed_phones = json.loads(m1.group(1)) if m1 else []
seed_sold = json.loads(m2.group(1)) if m2 else []

print(f"Excel: Còn Hàng: {len(con_hang)}, Chưa xử lý: {len(chua_xu_ly)}, Đã Bán: {len(da_ban)}")
print(f"Seed: SEED_PHONES_DATA: {len(seed_phones)}, SEED_SOLD_DATA: {len(seed_sold)}")

# Check if first items match
print("\nFirst Con Hang Excel:", con_hang[0].get('B'), con_hang[0].get('C'), con_hang[0].get('D'))
print("First Seed Phone:", seed_phones[0].get('brand'), seed_phones[0].get('name'), seed_phones[0].get('imei'), seed_phones[0].get('status'))

print("\nFirst Chua Xu Ly Excel:", chua_xu_ly[0].get('B'), chua_xu_ly[0].get('C'), chua_xu_ly[0].get('D'))
seed_cxl = [p for p in seed_phones if 'chưa xử lý' in (p.get('status') or '').lower()]
print("Count seed chua xu ly:", len(seed_cxl))
if seed_cxl:
    print("First Seed Chua Xu Ly:", seed_cxl[0].get('brand'), seed_cxl[0].get('name'), seed_cxl[0].get('imei'), seed_cxl[0].get('status'))

print("\nFirst Da Ban Excel:", da_ban[0].get('B'), da_ban[0].get('C'), da_ban[0].get('D'))
print("First Seed Sold:", seed_sold[0].get('brand'), seed_sold[0].get('name'), seed_sold[0].get('imei'), seed_sold[0].get('status'))


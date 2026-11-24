import zipfile
import xml.etree.ElementTree as ET
import os
import json
import re

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

# Load existing seed_data.js
with open('js/seed_data.js', 'r', encoding='utf-8') as f:
    text = f.read()

m1 = re.search(r'window\.SEED_PHONES_DATA\s*=\s*(\[.*?\]);', text, re.DOTALL)
m2 = re.search(r'window\.SEED_SOLD_DATA\s*=\s*(\[.*?\]);', text, re.DOTALL)

old_phones = json.loads(m1.group(1)) if m1 else []
old_sold = json.loads(m2.group(1)) if m2 else []

print(f"Old seed phones: {len(old_phones)}, Old seed sold: {len(old_sold)}")
print(f"Excel Con Hang: {len(con_hang)}, Chua Xu Ly: {len(chua_xu_ly)}, Da Ban: {len(da_ban)}")

# Map old phones by IMEI
old_phones_map = {}
for p in old_phones:
    imei = (p.get('imei') or '').strip().lower()
    if imei and imei != '....':
        old_phones_map[imei] = p

old_sold_map = {}
for s in old_sold:
    imei = (s.get('imei') or '').strip().lower()
    if imei and imei != '....':
        old_sold_map[imei] = s

# Helper to format price numbers: 1500 -> 1.500
def fmt_price(v):
    if not v:
        return '0'
    v_str = str(v).replace('.', '').replace(',', '').strip()
    try:
        val = int(v_str)
        return f"{val:,}".replace(',', '.')
    except:
        return str(v)

base_id = 1794046604868
new_phones = []

# Process Con Hang (168 rows)
for idx, row in enumerate(con_hang):
    imei = (row.get('D') or '').strip()
    matched = old_phones_map.get(imei.lower()) if imei else None
    
    brand = (row.get('B') or '').strip()
    name = (row.get('C') or '').strip()
    color = (row.get('E') or '').strip()
    storage = (row.get('F') or '').strip()
    battery_cap = (row.get('G') or '').strip()
    pin = (row.get('H') or '').strip()
    condition = (row.get('I') or '').strip()
    origin = (row.get('J') or '').strip()
    cost = fmt_price(row.get('L'))
    price = fmt_price(row.get('M'))
    status = 'Còn hàng'
    date_in = (row.get('O') or '').strip()
    warranty = (row.get('Q') or '1 Tháng').strip()
    note = (row.get('R') or '').strip()
    
    item_id = matched.get('id') if matched else (base_id + idx)
    pin_status = matched.get('pinStatus') if matched else ('Pin ' + pin if pin else 'Pin Zin')
    origin_code = matched.get('origin') if matched else (origin.split()[0] if origin else 'VN/A')

    item = {
        "id": item_id,
        "store": "Kim Chi Mobile",
        "brand": brand,
        "name": name,
        "model": name,
        "imei": imei,
        "color": color,
        "storage": storage,
        "batteryCap": battery_cap,
        "battery": battery_cap,
        "pin": battery_cap if ('%' in battery_cap or 'mAh' in battery_cap) else pin,
        "pinStatus": pin_status,
        "condition": condition,
        "country": origin,
        "origin": origin_code,
        "network": "Quốc tế",
        "cost": cost,
        "priceIn": cost,
        "price": price,
        "status": status,
        "dateIn": date_in,
        "date": date_in,
        "dateOut": "",
        "warranty": warranty,
        "note": note
    }
    new_phones.append(item)

# Process Chua Xu Ly (20 rows)
cxl_base_id = 1794046605868
for idx, row in enumerate(chua_xu_ly):
    imei = (row.get('D') or '').strip()
    matched = old_phones_map.get(imei.lower()) if imei and imei != '....' else None
    
    brand = (row.get('B') or '').strip()
    name = (row.get('C') or '').strip()
    color = (row.get('E') or '').strip()
    storage = (row.get('F') or '').strip()
    battery_cap = (row.get('G') or '').strip()
    pin = (row.get('H') or '').strip()
    condition = (row.get('I') or '').strip()
    origin = (row.get('J') or '').strip()
    cost = fmt_price(row.get('L'))
    price = fmt_price(row.get('M'))
    status = 'Chưa Xử Lý'
    date_in = (row.get('O') or '').strip()
    warranty = (row.get('Q') or '').strip()
    note = (row.get('R') or '').strip()
    
    item_id = matched.get('id') if matched else (cxl_base_id + idx)
    pin_status = matched.get('pinStatus') if matched else 'Pin Zin'
    origin_code = matched.get('origin') if matched else (origin.split()[0] if origin and origin != '?' else 'VN/A')

    item = {
        "id": item_id,
        "store": "Kim Chi Mobile",
        "brand": brand,
        "name": name,
        "model": name,
        "imei": imei,
        "color": color,
        "storage": storage,
        "batteryCap": battery_cap,
        "battery": battery_cap,
        "pin": battery_cap if ('%' in battery_cap or 'mAh' in battery_cap) else pin,
        "pinStatus": pin_status,
        "condition": condition,
        "country": origin,
        "origin": origin_code,
        "network": "Quốc tế",
        "cost": cost,
        "priceIn": cost,
        "price": price,
        "status": status,
        "dateIn": date_in,
        "date": date_in,
        "dateOut": "",
        "warranty": warranty,
        "note": note
    }
    new_phones.append(item)

# Process Da Ban / Bao Hanh (96 rows)
sold_base_id = 1794046606868
new_sold = []
for idx, row in enumerate(da_ban):
    imei = (row.get('D') or '').strip()
    matched = old_sold_map.get(imei.lower()) if imei and imei != '....' else None
    
    brand = (row.get('B') or '').strip()
    name = (row.get('C') or '').strip()
    color = (row.get('E') or '').strip()
    storage = (row.get('F') or '').strip()
    battery_cap = (row.get('G') or '').strip()
    pin = (row.get('H') or '').strip()
    condition = (row.get('I') or '').strip()
    origin = (row.get('J') or '').strip()
    cost = fmt_price(row.get('L'))
    price = fmt_price(row.get('M'))
    status = 'Đã bán'
    date_in = (row.get('O') or '').strip()
    date_out = (row.get('P') or '').strip()
    warranty = (row.get('Q') or '3 Tháng').strip()
    note = (row.get('R') or '').strip()
    
    item_id = matched.get('id') if matched else (sold_base_id + idx)
    customer = matched.get('customer') if matched else 'Khách Lẻ'
    
    item = {
        "id": item_id,
        "store": "Kim Chi Mobile",
        "brand": brand,
        "name": name,
        "model": name,
        "imei": imei,
        "color": color,
        "storage": storage,
        "batteryCap": battery_cap,
        "battery": battery_cap,
        "pin": battery_cap if ('%' in battery_cap or 'mAh' in battery_cap) else pin,
        "pinStatus": matched.get('pinStatus', 'Pin Zin') if matched else 'Pin Zin',
        "condition": condition,
        "country": origin,
        "origin": matched.get('origin', origin.split()[0] if origin else 'VN/A') if matched else (origin.split()[0] if origin else 'VN/A'),
        "network": "Quốc tế",
        "cost": cost,
        "priceIn": cost,
        "price": price,
        "total": price,
        "status": status,
        "dateIn": date_in,
        "date": date_out or date_in,
        "soldDate": date_out or date_in,
        "dateTime": date_out or date_in,
        "soldDateTime": date_out or date_in,
        "customer": customer,
        "dateOut": date_out,
        "warranty": warranty,
        "note": note
    }
    new_sold.append(item)

print(f"Result: new_phones: {len(new_phones)} (Con Hang: {len([p for p in new_phones if p['status'] != 'Chưa Xử Lý'])}, Chua Xu Ly: {len([p for p in new_phones if p['status'] == 'Chưa Xử Lý'])})")
print(f"Result: new_sold: {len(new_sold)}")

# Write to js/seed_data.js
output_js = f"window.SEED_PHONES_DATA = {json.dumps(new_phones, ensure_ascii=False)};\n\nwindow.SEED_SOLD_DATA = {json.dumps(new_sold, ensure_ascii=False)};\n"
with open('js/seed_data.js', 'w', encoding='utf-8') as f:
    f.write(output_js)
print("Updated js/seed_data.js successfully!")


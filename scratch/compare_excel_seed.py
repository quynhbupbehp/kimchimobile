import zipfile
import xml.etree.ElementTree as ET
import os
import json

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
        header = rows[0]
        data_rows = []
        for r in rows[1:]:
            if not any(r.values()):
                continue
            data_rows.append(r)
        return header, data_rows

folder = r'C:\Users\quynhbupbehp\Desktop\TAB BÁN MÁY'
for fname in ['Còn Hàng.xlsx', 'Chưa xử lý.xlsx', 'Đã Bán  ( Bảo Hành).xlsx']:
    fpath = os.path.join(folder, fname)
    h, rows = parse_xlsx(fpath)
    print(f"=== {fname} ({len(rows)} rows) ===")
    print("Header:", h)
    for i in range(min(3, len(rows))):
        print(f"Row {i+1}:", rows[i])


import zipfile
import xml.etree.ElementTree as ET
import os
import json

def read_xlsx(path):
    with zipfile.ZipFile(path, 'r') as z:
        # read sharedStrings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            # namespace
            ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
            for si in tree.findall('.//ns:si', ns):
                texts = [t.text or '' for t in si.findall('.//ns:t', ns)]
                shared_strings.append(''.join(texts))
        
        # read sheet1
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
        return rows

folder = r'C:\Users\quynhbupbehp\Desktop\TAB BÁN MÁY'
for fname in os.listdir(folder):
    if fname.endswith('.xlsx'):
        fpath = os.path.join(folder, fname)
        rows = read_xlsx(fpath)
        print(f"=== {fname} === Total Rows: {len(rows)}")
        if rows:
            print("First row:", json.dumps(rows[0], ensure_ascii=False))
            if len(rows) > 1:
                print("Second row:", json.dumps(rows[1], ensure_ascii=False))


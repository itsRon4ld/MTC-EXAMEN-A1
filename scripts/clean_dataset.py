import json
import re

json_path = r'C:\Users\RONALD\Documents\Personal\src\core\training-quiz\server\data\balotario-200.json'

# First re-run extract_all.py to get valid raw JSON
with open(json_path, 'r', encoding='utf-8') as f:
    pass

word_map = {
    'Est': 'Está', 'est': 'está', 'estn': 'están', 'Estn': 'Están',
    'va': 'vía', 'Va': 'Vía', 'vas': 'vías', 'Vas': 'Vías',
    'seal': 'señal', 'Seal': 'Señal', 'seales': 'señales', 'Seales': 'Señales',
    'sealizacin': 'señalización', 'Sealizacin': 'Señalización',
    'sealética': 'señalética', 'Sealética': 'Señalética',
    'sealizar': 'señalizar', 'sealados': 'señalados', 'seale': 'señale',
    'grfico': 'gráfico', 'Grfico': 'Gráfico', 'grficos': 'gráficos',
    'vehculo': 'vehículo', 'Vehculo': 'Vehículo', 'vehculos': 'vehículos', 'Vehculos': 'Vehículos',
    'Trnsito': 'Tránsito', 'trnsito': 'tránsito',
    'infraccin': 'infracción', 'Infraccin': 'Infracción',
    'infracciones': 'infracciones', 'Infracciones': 'Infracciones',
    'sanccin': 'sanción', 'sancin': 'sanción',
    'evaluacin': 'evaluación', 'Evaluacin': 'Evaluación',
    'categora': 'categoría', 'Categora': 'Categoría',
    'Qu': '¿Qué', 'qu': '¿qué', 'Cundo': '¿Cuándo', 'cundo': '¿cuándo',
    'Cul': '¿Cuál', 'cul': '¿cuál', 'Influye': '¿Influye',
    'ms': 'más', 'Ms': 'Más',
    'mxima': 'máxima', 'mximas': 'máximas', 'mximo': 'máximo', 'mximos': 'máximos',
    'mnima': 'mínima', 'mnimas': 'mínimas', 'mnimo': 'mínimo', 'mnimos': 'mínimos',
    'podrn': 'podrán', 'podr': 'podrá',
    'detencin': 'detención', 'Detencin': 'Detención',
    'prevencin': 'prevención', 'Prevencin': 'Prevención',
    'disminucin': 'disminución', 'Disminucin': 'Disminución',
    'circulacin': 'circulación', 'Circulacin': 'Circulación',
    'direccin': 'dirección', 'posicin': 'posición', 'Posicin': 'Posición',
    'peatn': 'peatón', 'Peatn': 'Peatón',
    'reglamentacin': 'reglamentación', 'obligacin': 'obligación', 'Obligacin': 'Obligación',
    'autorizacin': 'autorización', 'revalidacin': 'revalidación',
    'recategorizacin': 'recategorización', 'restriccin': 'restricción',
    'interseccin': 'intersección', 'Interseccin': 'Intersección',
    'situacin': 'situación', 'condicin': 'condición',
    'conduccin': 'conducción', 'Conduccin': 'Conducción',
    'atencin': 'atención', 'comisin': 'comisión', 'inspeccin': 'inspección',
    'tambin': 'también', 'despus': 'después', 'Despus': 'Después',
    'ser': 'será', 'deber': 'deberá', 'Deber': 'Deberá', 'debern': 'deberán',
    'efecta': 'efectúa', 'lnea': 'línea', 'Lnea': 'Línea', 'lneas': 'líneas',
    'lmite': 'límite', 'Lmite': 'Límite', 'lmites': 'límites',
    'frreas': 'férreas', 'frrea': 'férrea', 'fsica': 'física',
    'pblica': 'pública', 'pblicas': 'públicas', 'mbar': 'ámbar',
    'rea': 'área', 'reas': 'áreas', 'mnibus': 'ómnibus', 'valo': 'óvalo',
    'nico': 'único', 'nica': 'única', 'nicamente': 'únicamente',
    'antigedad': 'antigüedad', 'demarcacin': 'demarcación',
    'reduccin': 'reducción', 'Reduccin': 'Reducción',
    'aproximacin': 'aproximación', 'ubicacin': 'ubicación',
    'semforo': 'semáforo', 'semforos': 'semáforos',
    'polica': 'policía', 'Polica': 'Policía',
    'llantera': 'llantería', 'ferretera': 'ferretería',
    'guan': 'guían', 'contina': 'continúa', 'automviles': 'automóviles',
    'cdigo': 'código', 'Cdigo': 'Código',
    'S': 'Sí', 's': 'sí',
    'prohbe': 'prohíbe', 'Prohbe': 'Prohíbe', 'prohibicin': 'prohibición',
    'rpidamente': 'rápidamente', 'rpido': 'rápido',
    'alucingenos': 'alucinógenos', 'narcticos': 'narcóticos',
    'alcoholmetro': 'alcoholímetro', 'cinturn': 'cinturón',
    'badn': 'badén', 'inmovilizado': 'inmovilizado',
    'informacin': 'información', 'excepcin': 'excepción', 'excepciones': 'excepciones',
    'compaa': 'compañía', 'Compaa': 'Compañía', 'agrcola': 'agrícola',
    'ao': 'año', 'aos': 'años', 'nios': 'niños', 'nio': 'niño'
}

def clean_str(s):
    if not isinstance(s, str):
        return s
    # Fix broken quotes
    s = s.replace('¿prohibido voltear a la izquierda¿', '"prohibido voltear a la izquierda"')
    s = s.replace('¿CEDA EL PASO?', '"CEDA EL PASO"')
    s = s.replace('¿U¿', '"U"')
    # Word replacements
    for k, v in word_map.items():
        s = re.sub(r'\b' + re.escape(k) + r'\b', v, s)
    # Remove any remaining 
    s = s.replace('', '')
    return s

# Re-run extract_all
import subprocess
subprocess.run(['python', 'scripts/extract_all.py'], check=True)

with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

for q in data:
    q['prompt'] = clean_str(q['prompt'])
    q['category'] = clean_str(q['category'])
    if q['code']:
        q['code'] = clean_str(q['code'])
    for opt in q['options']:
        opt['text'] = clean_str(opt['text'])

with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

import os
os.makedirs(r'C:\Users\RONALD\Documents\Personal\public\data', exist_ok=True)
with open(r'C:\Users\RONALD\Documents\Personal\public\data\balotario-200.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Accents and Spanish symbols cleanly fixed and saved!")
print(f"Total questions: {len(data)}")

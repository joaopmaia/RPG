"""
Constantes compartilhadas do projeto RPG.
"""

ATRIBUTOS = [
    "Força",
    "Destreza",
    "Vitalidade",
    "Inteligência",
    "Carisma",
    "Espírito",
    "Percepção",
]

RACAS = [
    "Vaelthor",
    "Drovenar",
    "Sylmari",
    "Gorvash",
    "Sharusahk",
]

TIPOS_NPC = [
    "Mercadores",
    "Nobres",
    "Guardas",
    "Ladinos",
    "Assassinos",
    "Mensageiros",
    "Alquimista",
    "Bardo",
    "Criminoso",
    "Pirata",
    "Cidadão",
]

DEMONS = [
    "inferior",
    "normal",
    "superior",
]

ANIMALS = [
    "comum",
    "grande",
    "arcano",
]

# ═══════════════════════════════════════════════════
#  Chances de Rank do Material por Nível (%)
# ═══════════════════════════════════════════════════

CHANCES_RANK = {
    1: {"F": 40, "E": 30, "D": 20, "C": 10},
    2: {"F": 30, "E": 25, "D": 20, "C": 15, "B": 10},
    3: {"F": 10, "E": 15, "D": 20, "C": 25, "B": 20, "A": 10},
    4: {"C": 15, "B": 45, "A": 30, "S": 10},
    5: {"A": 60, "S": 40},
}

# ═══════════════════════════════════════════════════
#  Chances de Runa por Nível (%)
# ═══════════════════════════════════════════════════

CHANCES_RUNA = {
    1: {"Nenhuma": 90, "Básico": 10},
    2: {"Nenhuma": 70, "Básico": 20, "Intermediário": 10},
    3: {"Nenhuma": 65, "Básico": 20, "Intermediário": 10, "Superior": 5},
    4: {"Nenhuma": 30, "Básico": 40, "Intermediário": 20, "Superior": 10},
    5: {"Básico": 10, "Intermediário": 60, "Superior": 30},
}

#!/usr/bin/env bash
# Baixa os materiais oficiais de exemplo do CILS B1 Cittadinanza para uso LOCAL
# de desenvolvimento (construir provas, audio de seed, folha de respostas).
#
# Os arquivos NAO entram no git (ver docs/official/ no .gitignore): os direitos sono
# dell'Universita per Stranieri di Siena. Em qualquer material derivato que va per l'app
# (banco de questoes, audio, folha de respostas) a fonte deve ser citada.
#
# Uso: bash scripts/fetch-official-samples.sh

set -euo pipefail

BASE="https://cils.unistrasi.it/public/articoli/382"
OUT="${1:-docs/official}"
mkdir -p "$OUT"

fetch() {
  local name="$1" url="$2"
  echo "-> $name"
  curl -sSL --max-time 180 -o "$OUT/$name" "$url"
}

fetch "Sillabo_B1_Cittadinanza.pdf"        "$BASE/B1%20Cittadinanza_Sillabo.pdf"
fetch "Criteri_B1_Cittadinanza.pdf"        "$BASE/Criteri%20di%20valutazione%20B1%20cittadinanza_nuovi.pdf"
fetch "Quaderno_B1_Cittadinanza.pdf"       "$BASE/Prototipo%20Quaderno%20B1%20Cittadinanza.pdf"
fetch "Trascrizioni_B1_Cittadinanza.pdf"   "$BASE/TRASCRIZIONI%20B1%20Cittadinanza.pdf"
fetch "Produzione_Scritta_B1c.pdf"         "$BASE/PS_B1_Cittadinanza.pdf"
fetch "Produzione_Orale_B1c.pdf"           "$BASE/Input%20aggiuntivo_B1citt_1_PO.pdf"
fetch "Foglio_Responses_B1c.pdf"           "$BASE/B1_CITTADINANZA_v2.pdf"
fetch "Audio_B1_Cittadinanza.mp3"          "$BASE/UNO_B1%20cittadinanza.mp3"

echo
echo "OK. Materiais em $OUT/"
echo "Ricorda di citare la fonte: Universita per Stranieri di Siena - CILS."

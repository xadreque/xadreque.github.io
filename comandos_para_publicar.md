depois de arrastar afoto para o cheiro proprio 
deve-se:    mv ~/Downloads/lavamoz-1.jpg ~/xadreque.github.io/img/

cd xadreque.github.io
git add .
git commit -m "Adicionei grafico de visitas"
git push
vercel --prod --force

# Para troca de alias de xadreque 

# 1. Atribuir o alias correto com apenas um 'r'
vercel alias set portifolio-xadреque-78b43echv-xadreques-projects.vercel.app portifolio-xadreque.vercel.app

# Ou atribuir diretamente ao seu projeto atual de produção:
vercel alias set https://portifolio-xadrreque.vercel.app portifolio-xadreque.vercel.app

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Service from '@/services/service.js'

const router = useRouter()

const categories = ['roman', 'poesie', 'theatre', 'essai', 'biographie', 'science', 'histoire']
const titre = ref('')
const categorie = ref('')
const num_pages = ref(0)
const extrait_livre = ref<File | null>(null)
const resume = ref('')
const nom_auteur = ref('')
const prenom_auteur = ref('')
const nom_editeur = ref('')
const annee_edition = ref(0)
const image_couverture = ref<File | null>(null)

const onCoverIgmChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // which type of image is accepted
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  // check if the file is on the list
  if (!allowedTypes.includes(file.type)) {
    alert('Format invalide ! Veuillez choisir une image JPG/JPEG/PNG/WEBP.')
    target.value = ''
    return
  }

  // url of the file (temporaly in the ram)
  let src = URL.createObjectURL(file)

  // get the id of the html element
  let imagePreview = document.getElementById('test') as HTMLImageElement

  // add a image as preview
  if (imagePreview) {
    imagePreview.src = src
    imagePreview.style.display = 'block'
  }

  // defin the value
  image_couverture.value = file
}

const onCoverExtraitChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (file && file.type !== 'application/pdf') {
    alert('Format invalide ! Veuillez choisir un document au format PDF.')
    target.value = ''
    return
  } else {
    // defin the value
    extrait_livre.value = file
  }
}

const addBook = () => {
  // post the result

  const newBook = {
    titre: titre.value,
    categorie: categorie.value,
    nbPages: num_pages.value,
    extrait: extrait_livre.value ? `/extraitsLivres/${extrait_livre.value.name}` : '',
    resume: resume.value,
    auteur: {
      nom: nom_auteur.value,
      prenom: prenom_auteur.value,
    },
    editeur: nom_editeur.value,
    anneeEdition: annee_edition.value,
    imageCouverture: image_couverture.value
      ? `/book covers/${image_couverture.value.name}`
      : `/book covers/1.jpg`,
  }

  Service.addBookToDB(newBook).then()

  // return the view
  router.push('/books')
}
</script>

<template>
  <form class="add_book_form" enctype="multipart/form-data" @submit.prevent="addBook">
    <label for="titre">Titre</label>
    <input type="text" v-model="titre" id="titre" class="name_input" required />

    <label for="categorie">Categorie</label>
    <select id="categorie" v-model="categorie" class="categorie_select" required>
      <option v-for="categorie in categories" :key="categorie" :value="categorie">
        {{ categorie }}
      </option>
    </select>

    <label for="num_pages">Nombre de pages</label>
    <input type="number" id="num_pages" class="num_input" v-model="num_pages" required />

    <label for="extrait_livre">Extrait du livre</label>
    <input
      type="file"
      id="extrait_livre"
      class="extrait_input"
      accept=".pdf"
      @change="onCoverExtraitChange"
    />

    <label for="resume" class="resume_label">Résumé</label>
    <textarea
      id="resume"
      v-model="resume"
      class="resume_input"
      placeholder="Résumé de votre livre..."
      required
    ></textarea>

    <label for="nom_auteur">Nom de l'auteur</label>
    <input type="text" v-model="nom_auteur" id="nom_auteur" class="name_input" required />

    <label for="prenom_auteur">Prénom de l'auteur</label>
    <input type="text" v-model="prenom_auteur" id="prenom_auteur" class="name_input" required />

    <label for="nom_editeur">Nom de l'éditeur</label>
    <input type="text" v-model="nom_editeur" id="nom_editeur" class="name_input" required />

    <label for="annee_edition">Année d'édition</label>
    <input type="number" v-model="annee_edition" id="annee_edition" class="num_input" required />

    <label for="image_couverture">Image de couverture</label>
    <div class="cover_div">
      <input
        type="file"
        id="image_couverture"
        accept=".jpg, .jpeg, .png, .webp"
        class="cover_img_input"
        @change="onCoverIgmChange"
      />
      <img
        id="test"
        src="https://static.wikia.nocookie.net/shrek/images/8/85/Shrek_2001_poster.jpg/revision/latest/scale-to-width-down/1200?cb=20201020072731"
        alt="Image uploaded by the user"
        class="cover_img"
      />
    </div>

    <button type="submit" class="submit_button">Ajouter le livre</button>
  </form>
</template>

<style scoped>
.add_book_form {
  margin-top: 100px;

  display: grid;
  grid-template-columns: 1fr 4fr;
  gap: 63px;

  justify-self: center;
  justify-content: center;
  align-items: center;
  margin: 0px 50px;
}

.add_book_form > input,
.add_book_form > textarea,
.add_book_form > div > input,
.add_book_form > select {
  resize: none;
  background-color: var(--main);
  border: 2px, solid;
  border-color: var(--third-2);
  border-radius: 10px;
  padding: 4px;
  padding-left: 10px;
}

/* style of the inputs */

.categorie_select {
  width: 18%;
}

.num_input {
  width: 50px;
}

input::file-selector-button {
  display: none;
}

.extrait_input {
  width: 40%;
  min-width: 180px;
  transition: 0.2s;
}

.extrait_input:hover {
  cursor: pointer;
  border-color: var(--third);
  transition: 0.2s;
}

.resume_input {
  width: 100%;
  height: 200px;
}

.name_input {
  min-width: 400px;
  width: 40%;
}

.date_input {
  width: 20%;
}

.cover_img_input:hover {
  cursor: pointer;
  border-color: var(--third);
  transition: 0.2s;
}

/* style of the labels */

.resume_label {
  align-self: self-start;
}

.cover_img {
  display: none;

  max-width: 100px;
  height: auto;
  border: 2px solid var(--third-2);
  border-radius: 10px;
  position: absolute;
  left: 300px;
}

.cover_div {
  display: flex;
  align-items: start;
  position: relative;
}

.submit_button {
  padding: 20px;
  background-color: var(--main);
  border-radius: 10px;
  border-color: var(--third-2);
  box-shadow: 0;
}

/* about the html default style */

datalist option:hover,
datalist option:focus {
  color: #fff;
  background-color: #036;
  outline: 0 none;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
</style>

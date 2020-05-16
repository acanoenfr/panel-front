<template>
    <v-card id="confirmDialog">
        <v-card-title class="headline grey darken-3 white--text">
            Confirmation utilisateur
        </v-card-title>
        <v-card-text>
            <h3 style="font-size: 1.5rem; margin-top: 1rem;">Êtes-vous sûr d'effectuer cette action ?</h3>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog">Non, annuler</v-btn>
            <v-btn class="error" @click="saveDialog">Oui, confirmer</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        name: "ConfirmDialog",
        props: [
            "closeDialog", "saveDialog"
        ]
    }
</script>

<style scoped>

</style>
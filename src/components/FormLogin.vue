<template>
    <v-card class="elevation-12">
        <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Connexion - Bespin</v-toolbar-title>
        </v-toolbar>
        <v-form @submit.prevent="onLogin">
            <v-card-text>
                <v-text-field
                    v-model="username"
                    label="Nom d'utilisateur"
                    name="username"
                    prepend-icon="mdi-account"
                    autofocus
                    type="text">
                </v-text-field>
                <v-text-field
                    v-model="password"
                    label="Mot de passe"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password">
                </v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="primary">Se connecter</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>

<script>
    export default {
        name: "FormLogin",
        data() {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            onLogin() {
                this.$emit('login', {
                    username: this.username,
                    password: this.password
                })
            }
        }
    }
</script>

<style scoped>

</style>
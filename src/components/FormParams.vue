<template>
    <v-row id="formParams">
        <v-col align="center">
            <h2>Modifier mes informations</h2>
            <v-form @submit.prevent="changeInfos">
                <v-text-field
                        label="Nom d'utilisateur"
                        v-model="user.name"
                        type="text">
                </v-text-field>
                <v-text-field
                        label="Adresse e-mail"
                        v-model="user.email"
                        type="email">
                </v-text-field>
                <v-select
                        label="Rôle"
                        v-model="user.isAdmin"
                        :items="[{text:'Utilisateur',value:false},{text:'Administrateur',value:true}]"
                        item-text="text"
                        item-value="value"
                        :disabled="true">
                </v-select>
                <v-btn type="submit" color="primary" block>
                    Sauvegarder mes informations
                </v-btn>
            </v-form>
        </v-col>
        <v-col align="center">
            <h2>Modifier mon mot de passe</h2>
            <v-form @submit.prevent="changePassword">
                <v-text-field
                        label="Mot de passe actuel"
                        v-model="oldPassword"
                        type="password">
                </v-text-field>
                <v-text-field
                        label="Nouveau mot de passe"
                        v-model="newPassword"
                        type="password">
                </v-text-field>
                <v-text-field
                        label="Confirmation du mot de passe"
                        v-model="confirmation"
                        type="password">
                </v-text-field>
                <v-btn type="submit" color="warning" block :disabled="!checkFieldsOk">
                    Changer mon mot de passe
                </v-btn>
            </v-form>
        </v-col>
    </v-row>
</template>

<script>
    import users from "../services/users"

    export default {
        name: "FormParams",
        data() {
            return {
                user: this.$store.getters.user,
                oldPassword: '',
                newPassword: '',
                confirmation: ''
            }
        },
        methods: {
            changeInfos() {
                users.updateProfile(this.user)
                    .then(info => {
                        if (info.error) {
                            this.$store.commit('CALL_MSG', {
                                text: info.error,
                                color: 'error',
                                show: true
                            })
                        } else {
                            this.$store.commit('CALL_MSG', {
                                text: info.message,
                                color: 'success',
                                show: true
                            })
                        }
                    })
            },
            changePassword() {
                let user = Object.assign({}, this.user)
                user['password'] = this.oldPassword
                user['newPassword'] = this.newPassword
                users.updateProfile(user)
                    .then(info => {
                        if (info.error) {
                            this.$store.commit('CALL_MSG', {
                                text: info.error,
                                color: 'error',
                                show: true
                            })
                        } else {
                            this.$store.commit('CALL_MSG', {
                                text: info.message,
                                color: 'success',
                                show: true
                            })
                        }
                    })
                this.oldPassword = ''
                this.newPassword = ''
                this.confirmation = ''
            }
        },
        computed: {
            checkFieldsOk() {
                return (this.oldPassword && this.newPassword && this.confirmation) &&
                    this.newPassword === this.confirmation
            }
        }
    }
</script>

<style scoped>

</style>
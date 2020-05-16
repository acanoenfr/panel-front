<template>
    <div id="tableServers">
        <v-data-table
            :headers="headers"
            :items="servers"
            sort-by="name"
            class="elevation-4">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Serveurs enregistrés</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" :disabled="!$store.getters.isAdmin">Ajouter un serveur</v-btn>
                </v-toolbar>
            </template>
            <template v-slot:item.isProxy="{ item }">
                {{ item.isProxy ? 'Waterfall' : 'Paper' }}
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon v-if="item.state === 'Arrêté'" color="success" class="mr-2" title="Démarrer le serveur" @click="startItem(item.id)">
                    mdi-play
                </v-icon>
                <v-icon v-if="item.state === 'Démarré'" color="orange darken-1" class="mr-2" title="Arrêter le serveur" @click="stopItem(item.id)">
                    mdi-stop
                </v-icon>
                <v-icon class="mr-2" title="Afficher la console" @click="true">
                    mdi-console
                </v-icon>
                <v-icon class="mr-2" title="Editer le serveur" @click="true" :disabled="!$store.getters.isAdmin">
                    mdi-pencil
                </v-icon>
                <v-icon color="red darken-1" class="mr-2" title="Supprimer le serveur" @click="true" :disabled="!$store.getters.isAdmin">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import servers from "../services/servers"
    import actions from "../services/actions"

    export default {
        name: "TableServers",
        data() {
            return {
                headers: [
                    { text: 'Etat', value: 'state', sortable: true },
                    { text: 'Nom', value: 'name', sortable: true },
                    { text: 'Type', value: 'isProxy', sortable: false },
                    { text: 'Chemin', value: 'path', sortable: false },
                    { text: 'Actions', value: 'actions', sortable: false },
                ],
                servers: [],
                editedIndex: -1,
                editedItem: { id: 0, name: '', isProxy: false, path: '' },
                defaultItem: { id: 0, name: '', isProxy: false, path: '' },
            }
        },
        methods: {
            startItem(id) {
                actions.startServer(id)
                    .then(info => {
                        this.$store.commit('CALL_MSG', {
                            text: info.message,
                            color: 'info',
                            show: true
                        })
                    })
            },
            stopItem(id) {
                actions.stopServer(id)
                    .then(info => {
                        this.$store.commit('CALL_MSG', {
                            text: info.message,
                            color: 'info',
                            show: true
                        })
                    })
            }
        },
        mounted() {
            this.servers = []
            servers.getAllServers()
                .then(servers => {
                    servers.forEach(async x => {
                        this.servers.push({
                            id: x.id,
                            name: x.name,
                            isProxy: x.isProxy,
                            path: x.path,
                            state: (await actions.getServerStatus(x.id)).message === 'Running' ? 'Démarré' : 'Arrêté'
                        })
                    })
                })
        }
    }
</script>

<style scoped>

</style>
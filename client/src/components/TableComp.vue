<template>
    <div>
        <section class="container">
            <!--for demo wrap-->
            <h1>Last created users</h1>
            <div class="tbl-header">
                <table cellpadding="0" cellspacing="0" border="0">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">Name</th>
                            <th scope="col">CreatedAt</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="tbl-content" id="tbl-content">
                <table class="table-body" cellpadding="0" cellspacing="0" border="0">
                    <p v-if="users.length == 0" style="font-size: 20px; font-weight: bold; text-align: center;">No user available</p>
                    <tbody v-else>
                        <tr v-for="bot in users">
                            <th scope="row">{{ bot.id }}</th>
                            <td data-title="Name">{{bot.name}}</td>
                            <td data-title="CreatedAt">{{new Date(bot.createdAt).toUTCString()}}</td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import type { User } from '@/utils';
import { onMounted } from 'vue';
defineProps<{
    users: User[]
}>()

onMounted(() => {
    window.addEventListener("load", calculateScrollbarWidth)
    window.addEventListener("resize", calculateScrollbarWidth)

    function calculateScrollbarWidth() {
        const tableContent: HTMLDivElement = document.querySelector(".tbl-content")!;
        const table: HTMLTableElement = document.querySelector(".tbl-content table")!;
        const tableHeader: HTMLDivElement = document.querySelector(".tbl-header")!;
        // if(tableContent)
        const scrollWidth = tableContent.offsetWidth - table.offsetWidth
        tableHeader.style.paddingRight = scrollWidth + 'px'
    }
})

</script>

<style scoped lang="scss">
// Breakpoints
$bp-sm: 15em;
$bp-md: 30em;
$bp-lg: 48em;
$bp-xl: 62em;
$bp-xxl: 75em;

h1 {
    font-size: 25px;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 15px;
}

table {
    width: 100%;
    table-layout: fixed;
}

.tbl-header {
    background-color: rgba(255, 255, 255, 0.3);

    thead {
        // Accessibly hide <thead> on narrow viewports
        position: absolute;
        clip: rect(1px 1px 1px 1px);
        /* IE6, IE7 */
        padding: 0;
        border: 0;
        height: 1px;
        width: 1px;
        overflow: hidden;

        @media (min-width: $bp-lg) {
            // Unhide <thead> on wide viewports
            position: relative;
            clip: auto;
            height: auto;
            width: auto;
            overflow: auto;
        }

        th {
            background-color: rgb(57, 58, 57);
            border: 1px solid rgb(105, 105, 104);
            font-weight: normal;
            text-align: center;

            &:first-of-type {
                text-align: left;
            }

            padding: .5em;
            vertical-align: middle;

            @media (min-width: $bp-md) {
                padding: .75em .5em;
            }

            @media (min-width: $bp-lg) {
                // Undo display: block 
                display: table-cell;
                padding: .5em;
            }

            @media (min-width: $bp-xl) {
                padding: .75em .5em;
            }

            @media (min-width: $bp-xxl) {
                padding: .75em;
            }
        }
    }
}

.tbl-content {
    height: 300px;
    overflow-x: scroll;
    margin-top: 0px;
    border: 1px solid rgba(255, 255, 255, 0.3);
}


/* for custom scrollbar for webkit browser*/

::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}

::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}



.container {
    margin: 5% 3%;

    @media (min-width: $bp-lg) {
        margin: 2%;
    }

    @media (min-width: $bp-xxl) {
        margin: 2em auto;
        max-width: $bp-xxl;
    }
}

.table-body {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;

    @media (min-width: $bp-lg) {
        font-size: .9em;
    }

    @media (min-width: $bp-xl) {
        font-size: 1em;
    }

    thead {
        // Accessibly hide <thead> on narrow viewports
        position: absolute;
        clip: rect(1px 1px 1px 1px);
        /* IE6, IE7 */
        padding: 0;
        border: 0;
        height: 1px;
        width: 1px;
        overflow: hidden;

        @media (min-width: $bp-lg) {
            // Unhide <thead> on wide viewports
            position: relative;
            clip: auto;
            height: auto;
            width: auto;
            overflow: auto;
        }

        th {
            background-color: rgb(57, 58, 57);
            border: 1px solid rgb(105, 105, 104);
            font-weight: normal;
            text-align: center;
            color: white;

            &:first-of-type {
                text-align: left;
            }
        }
    }

    // Set these items to display: block for narrow viewports
    tbody,
    tr,
    th,
    td {
        display: block;
        padding: 0;
        text-align: left;
        white-space: normal;
    }

    tr {
        @media (min-width: $bp-lg) {
            // Undo display: block 
            display: table-row;
        }
    }

    th,
    td {
        padding: .5em;
        vertical-align: middle;

        @media (min-width: $bp-md) {
            padding: .75em .5em;
        }

        @media (min-width: $bp-lg) {
            // Undo display: block 
            display: table-cell;
            padding: .5em;
        }

        @media (min-width: $bp-xl) {
            padding: .75em .5em;
        }

        @media (min-width: $bp-xxl) {
            padding: .75em;
        }
    }

    tbody {
        @media (min-width: $bp-lg) {
            // Undo display: block 
            display: table-row-group;
        }

        tr {
            margin-bottom: 1em;

            @media (min-width: $bp-lg) {
                // Undo display: block 
                display: table-row;
                border-width: 1px;
            }

            &:last-of-type {
                margin-bottom: 0;
            }

            &:nth-of-type(even) {
                @media (min-width: $bp-lg) {
                    background-color: rgba(0, 0, 0, .12);
                }
            }
        }

        th[scope="row"] {
            background-color: rgb(57, 58, 57);


            @media (min-width: $bp-lg) {
                background-color: transparent;
                text-align: left;
            }
        }

        td {
            text-align: right;

            @media (min-width: $bp-lg) {
                border-left: 1px solid rgb(57, 58, 57);
                border-bottom: 1px solid rgb(57, 58, 57);
                text-align: center;
            }

            &:last-of-type {
                @media (min-width: $bp-lg) {
                    border-right: 1px solid rgb(57, 58, 57);
                }
            }
        }

        td[data-type=currency] {
            text-align: right;
        }

        td[data-title]:before {
            content: attr(data-title);
            float: left;
            font-size: .8em;

            @media (min-width: $bp-md) {
                font-size: .9em;
            }

            @media (min-width: $bp-lg) {
                // Don’t show data-title labels 
                content: none;
            }
        }
    }
}
</style>
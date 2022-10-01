<template>
  <inventory :live="false" class="full" />
</template>

<script>
import inventory from "~/components/inventory.vue";
export default {
//   middleware({ redirect, $auth }) {
//     const profile = $auth.user.employee;
//     const permissionViewInventory = profile.permission_view_inventory;
//     if (!permissionViewInventory) {
//       return redirect("/vender_home");
//     }
//   },
  components: {
    inventory,
  },
};
</script>

<style>
.full::-webkit-scrollbar {
  display: none;
}
</style>

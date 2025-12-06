/** @odoo-module */

import { PosStore } from "@point_of_sale/app/store/pos_store";
import { patch } from "@web/core/utils/patch";
import { ask } from "@point_of_sale/app/store/make_awaitable_dialog";
import { _t } from "@web/core/l10n/translation";
import { AlertDialog } from "@web/core/confirmation_dialog/confirmation_dialog";
import { NumberPopup } from "@point_of_sale/app/utils/input_popups/number_popup";

patch(PosStore.prototype, {
    //@override
    async onDeleteOrder(order) {
        if (this.get_cashier().pin_pos !== "") {
            this.dialog.add(NumberPopup, {
                title: _t("Ingresa tu PIN"),
                getPayload: async (passwd) => {
                    if (passwd === this.get_cashier().pin_pos) {
                        if (order.get_orderlines().length > 0) {
                            const confirmed = await ask(this.dialog, {
                                title: _t("Existing orderlines"),
                                body: _t(
                                    "%s has a total amount of %s, are you sure you want to delete this order?",
                                    order.pos_reference,
                                    this.env.utils.formatCurrency(order.get_total_with_tax())
                                ),
                            });
                            if (!confirmed) {
                                return false;
                            }
                        }
                        const orderIsDeleted = await this.deleteOrders([order]);
                        if (orderIsDeleted) {
                            order.uiState.displayed = false;
                            this.afterOrderDeletion();
                        }
                        return orderIsDeleted;
                    } else {
                        this.dialog.add(AlertDialog, {
                            title: _t("PIN incorrecto"),
                            body: _t("Por favor inténtelo de nuevo."),
                        });
                    }
                },
            });
        } else {
            this.dialog.add(AlertDialog, {
                title: _t("No tiene un password registrado"),
                body: _t("Consulte con su administrador."),
            });
        }
    },
    get_cashier() {
        this.user._role = this.user.raw.role;
        this.user._is_vendedor = this.user.raw.is_vendedor;
        this.user._is_cajero = this.user.raw.is_cajero;
        this.user._is_supervisor = this.user.raw.is_supervisor;
        this.user._is_admin = this.user.raw.is_admin;
        return this.user;
    }
});

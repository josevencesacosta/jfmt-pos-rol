import { PosOrderline } from "@point_of_sale/app/models/pos_order_line";
import { patch } from "@web/core/utils/patch";
import { formatCurrency } from "@point_of_sale/app/models/utils/currency";
import { getTaxesAfterFiscalPosition } from "@point_of_sale/app/models/utils/tax_utils";

patch(PosOrderline.prototype, {
    getDisplayData() {
        return {
            ...super.getDisplayData(),
            category_name: "",
        };
    },
    getDisplayDataPos() {
        return {
            productName: this.get_full_product_name(),
            category_name: this.product_id?.pos_categ_ids?.[0]?.name || "Sin categoría",
            price: this.getPriceString(),
            qty: this.get_quantity_str(),
            unit: this.product_id.uom_id ? this.product_id.uom_id.name : "",
            unitPrice: formatCurrency(this.get_unit_display_price(), this.currency),
            oldUnitPrice: this.get_old_unit_display_price()
                ? formatCurrency(this.get_old_unit_display_price(), this.currency)
                : "",
            discount: this.get_discount_str(),
            customerNote: this.get_customer_note() || "",
            internalNote: this.getNote(),
            comboParent: this.combo_parent_id?.get_full_product_name?.() || "",
            packLotLines: this.pack_lot_ids.map(
                (l) =>
                    `${l.pos_order_line_id.product_id.tracking == "lot" ? "Lot Number" : "SN"} ${
                        l.lot_name
                    }`
            ),
            price_without_discount: formatCurrency(
                this.getUnitDisplayPriceBeforeDiscount(),
                this.currency
            ),
            taxGroupLabels: [
                ...new Set(
                    getTaxesAfterFiscalPosition(
                        this.product_id.taxes_id,
                        this.order_id.fiscal_position_id,
                        this.models
                    )
                        ?.map((tax) => tax.tax_group_id.pos_receipt_label)
                        .filter((label) => label)
                ),
            ].join(" "),
        };
    }
});
import { PosOrder } from "@point_of_sale/app/models/pos_order";
import { patch } from "@web/core/utils/patch";
import { omit } from "@web/core/utils/objects";

patch(PosOrder.prototype, {
    export_for_printing(baseUrl, headerData) {
        const receipt = super.export_for_printing(baseUrl, headerData);
        receipt.orderlines = this.agruparCategorias(this.getSortedOrderlines().map((l) =>
            omit(l.getDisplayDataPos(), "internalNote")
        ))
        return receipt;
    },
    agruparCategorias(productos) {
        let categoriaAnterior = null;
        return productos.map(producto => {
            if (producto.category_name !== categoriaAnterior) {
                categoriaAnterior = producto.category_name;
                return producto;
            } else {
                return { ...producto, category_name: '' };
            }
        });
    },
});

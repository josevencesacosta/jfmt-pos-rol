# -*- coding: utf-8 -*-

from odoo import fields, models, api
from odoo.exceptions import ValidationError

class InheritResUsers(models.Model):
    _inherit = 'res.users'

    pin_pos = fields.Char(string='Pin POS', default='')

    @api.constrains('pin_pos')
    def _check_pin_pos(self):
        for record in self:
            if record.pin_pos and not record.pin_pos.isdigit():
                raise ValidationError("El PIN POS solo puede contener números.")

    @api.model
    def _load_pos_data_fields(self, config_id):
        data = super()._load_pos_data_fields(config_id)
        data += ['pin_pos']
        return data

    @api.model
    def _load_pos_data(self, data):
        res = super()._load_pos_data(data)
        vendedor_group_id = self.env.ref("jfmt-pos-rol.group_user_vendedor").id
        cajero_group_id = self.env.ref("jfmt-pos-rol.group_user_cajero").id
        supervisor_group_id = self.env.ref("jfmt-pos-rol.group_user_supervisor").id
        admin_group_id = self.env.ref("jfmt-pos-rol.group_user_admin").id
        domain = self._load_pos_data_domain(data)
        fields = self._load_pos_data_fields(data['pos.config']['data'][0]['id'])
        user = self.search_read(domain, fields, load=False)
        user[0]['is_vendedor'] = vendedor_group_id in user[0]['groups_id']
        user[0]['is_cajero'] = cajero_group_id in user[0]['groups_id']
        user[0]['is_supervisor'] = supervisor_group_id in user[0]['groups_id']
        user[0]['is_admin'] = admin_group_id in user[0]['groups_id']
        user[0]['role'] = 'manager' if data['pos.config']['data'][0]['group_pos_manager_id'] in user[0]['groups_id'] else 'cashier'
        del user[0]['groups_id']
        res['data'][0] = user[0]
        return res

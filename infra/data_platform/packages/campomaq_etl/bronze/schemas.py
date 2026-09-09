BRONZE_METADATA_COLUMNS = [
    "ingestion_run_id",
    "source_system",
    "source_object",
    "extracted_at",
    "source_row_hash",
]

SOURCE_SYSTEM = "on_prem_sql_server"

SOURCE_OBJECTS = {
    "products":      "EMPRESA.dbo.IVDIA_PRODUCTOS_LISTADO",
    "kardex":        "EMPRESA.dbo.IVDIA_STOCK_CORTE_FECHA",
    "stock":         "EMPRESA.dbo.IVDIA_STOCK_POR_CANTIDAD",
    "sales":         "EMPRESA.dbo.VEN_CLIENTES_VENTAS",
    "sales_detail":  "EMPRESA.dbo.VEN_VENTAS_CON_DETALLE",
    "credit_notes":  "EMPRESA.dbo.VEN_NC_DETALLE",
}

# Source column names in DDL order (lowercase, matching Postgres table definition).
PRODUCTS_SOURCE_COLUMNS = [
    "ieprod_iden", "iecate_codc", "iecate_nomc", "ieprod_codp", "ieprod_desp",
    "iemarc_iden", "iemarc_nomb", "ieprod_obse", "ieprod_pcos", "ieprod_viva",
    "ieprod_pvpp", "ieprod_pvp1", "ieprod_pvp2", "ieprod_pvp3", "ieprod_pvp4",
    "ieprod_cpro", "ieprod_tipo", "valiva", "ieprod_vitv",
]

KARDEX_SOURCE_COLUMNS = [
    "ieprod_iden", "iefave_iden", "ieprod_viva", "ieprod_pcos", "ieprod_cpro",
    "ieprod_codp", "ieprod_desp", "ieprod_vsst", "iefave_femi", "iedefv_cant",
    "tipo", "origen", "destino", "tm", "almacen", "fesucu_noms",
]

STOCK_SOURCE_COLUMNS = [
    "iemarc_nomb", "ieprod_codp", "ieprod_desp", "ieprod_pcos",
    "ieprov_empr", "ieprov_nomb", "iestop_stok", "fesucu_noms",
    "fesucu_cods", "iecate_codc", "iecate_nomc", "iemarc_iden",
]

SALES_SOURCE_COLUMNS = [
    "feclie_codc", "feempl_nome", "feempl_code", "emple_reg", "emple_cod",
    "emple_vfac", "emple_vcod", "fesucu_noms", "fesucu_cods", "iefave_ser3",
    "nombre", "feclie_iden", "iefave_civa", "iefave_siva", "iefave_viva",
    "iefave_dsct", "iefave_tota", "ceautv_trib", "tipo_fac", "iefave_femi",
    "ceautv_ser1", "ceautv_ser2", "peauxi_nomb", "iefave_vice", "iencrv_tota",
    "ret_iva", "ret_deuda", "ret_fte", "referidor", "iefave_recl",
    "fegru1_iden", "fegru1_nomb", "peprov_nomb",
]

SALES_DETAIL_SOURCE_COLUMNS = [
    "iestop_stok", "iedefv_iden", "iefave_iden", "fesucu_cods", "fesucu_noms",
    "iefave_femi", "iefave_hora", "iefave_ser3", "iefave_fina", "ceautv_naut",
    "ceautv_ser1", "ceautv_ser2", "ceautv_desc", "ceautv_trib", "iedefv_cost",
    "iedefv_vuni", "iedefv_dsct", "iedefv_viva", "iemedx_iden", "iemedx_nomb",
    "iedefv_cang", "iedefv_obse", "iedefv_reca", "ieprod_iden", "ieprod_codp",
    "ieprod_desp", "ieprod_viva", "ieprod_pcos", "placa", "iecate_codc",
    "iecate_nomc", "iemarc_iden", "iemarc_nomb", "feclie_codc", "feclie_apec",
    "feclie_nomc", "feclie_dirc", "feclie_telc", "feclie_tcec", "feclie_ttrc",
    "feclie_maic", "feempl_nome", "feempl_cedu", "seclav_codi", "seclav_usua",
    "ieserp_iden", "ieserp_seri", "ieserp_moto", "ieserp_chas", "ieserp_ncae",
    "ieserp_colo", "ieserp_tipo", "ieserp_anof", "nc_valo", "iva_de",
    "ieserp_matr", "ieserp_plac", "ieserp_jefa", "ieserp_orig", "ieserp_tone",
    "ieserp_cili", "iedenp_iden", "iedenp_plan", "iedcrv_iden", "provincia",
    "fegru1_iden", "fegru1_nomb", "nc_cant", "anio", "estilo", "estado",
    "precio", "pvp", "pvp1",
]

CREDIT_NOTES_SOURCE_COLUMNS = [
    "iencrv_deud", "iencrv_favo", "ceautv_iden", "iencrv_iden", "feclie_iden",
    "fesucu_cods", "feclie_nomc", "feclie_codc", "feclie_trib", "fegru1_iden",
    "feclie_apec", "feempl_code", "ceautv_esta", "iencrv_femi", "nsub5",
    "nsub8", "nsub12", "nsub15", "iencrv_civa", "iencrv_siva", "iencrv_dsct",
    "iencrv_viva", "iencrv_tota", "iencrv_esta", "fesucu_noms", "iencrv_ser3",
    "ceautv_ser1", "ceautv_ser2", "iefave_iden", "iefave_ser3", "fegru1_nomb",
    "ser1_facv", "ser2_facv", "iefave_femi", "iefave_civa", "vsub5", "vsub8",
    "vsub12", "vsub15", "iefave_siva", "iefave_dsct", "iefave_viva",
    "iefave_tota", "iefave_fina", "rt_i", "rt_r", "ceautv_trib",
    "iefave_esta", "ceautv_trib_fac",
]

# Fields used to compute source_row_hash per entity.
# Products/stock: price+status fields (detects value changes on the same key).
# Kardex: full identity fields (movements are immutable).
HASH_FIELDS = {
    "products":     ["ieprod_iden", "ieprod_pvpp", "ieprod_pvp1", "ieprod_pcos", "ieprod_viva"],
    "kardex":       ["ieprod_iden", "iefave_iden", "iedefv_cant", "tipo", "tm", "origen", "destino"],
    "stock":        ["ieprod_codp", "fesucu_cods", "iestop_stok"],
    "sales":        ["fesucu_cods", "ceautv_ser1", "ceautv_ser2", "iefave_ser3", "iefave_tota"],
    "sales_detail": ["iedefv_iden", "iedefv_cang", "iedefv_vuni", "iefave_iden"],
    "credit_notes": ["iencrv_iden", "iencrv_tota", "iencrv_femi"],
}

SOURCE_COLUMNS = {
    "products":     PRODUCTS_SOURCE_COLUMNS,
    "kardex":       KARDEX_SOURCE_COLUMNS,
    "stock":        STOCK_SOURCE_COLUMNS,
    "sales":        SALES_SOURCE_COLUMNS,
    "sales_detail": SALES_DETAIL_SOURCE_COLUMNS,
    "credit_notes": CREDIT_NOTES_SOURCE_COLUMNS,
}

# Bronze table names in Supabase
TABLE_NAMES = {
    "products":     "raw_products",
    "kardex":       "raw_kardex",
    "stock":        "raw_stock",
    "sales":        "raw_sales",
    "sales_detail": "raw_sales_detail",
    "credit_notes": "raw_credit_notes",
}

# Conflict target for ON CONFLICT in each table's upsert
CONFLICT_TARGETS = {
    "products":     "ieprod_iden",
    "kardex":       "source_row_hash",
    "stock":        "ieprod_codp, fesucu_cods",
    "sales":        "fesucu_cods, ceautv_ser1, ceautv_ser2, iefave_ser3",
    "sales_detail": "iedefv_iden",
    "credit_notes": "iencrv_iden",
}

# Whether to DO UPDATE (True) or DO NOTHING (False) on conflict
UPSERT_ON_CONFLICT = {
    "products":     True,   # update price/status changes
    "kardex":       False,  # movements are immutable
    "stock":        True,   # update stock quantity
    "sales":        True,   # invoices can be corrected
    "sales_detail": True,
    "credit_notes": True,
}

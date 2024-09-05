local typedefs = require "kong.db.schema.typedefs"

return {
    name = "custom-transformer",
    fields = {
        { consumer = typedefs.no_consumer },
        { protocols = typedefs.protocols_http },
        { config = {
            type = "record",
            fields = {}
        }}
    }
}

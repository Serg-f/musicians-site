local CustomTransformer = {
    PRIORITY = 1100,
    VERSION = "1.0",
}

function split_token(token)
    local _, _, actual_token = string.find(token, "Bearer%s+(.+)")
    return actual_token
end

function CustomTransformer:access(conf)
    kong.log.debug("Entering custom-transformer access phase")

    -- Extract the JWT token from Authorization header
    local auth_header = kong.request.get_header("Authorization")
    local jwt_token = auth_header and split_token(auth_header)

    if jwt_token then
        kong.log.debug("JWT token found: ", jwt_token)

        -- Use kong.plugins.jwt_decoder to decode the JWT token
        local jwt_decoder = require "kong.plugins.jwt.jwt_parser"
        local decoded_token, err = jwt_decoder:new(jwt_token)

        if not decoded_token then
            kong.log.err("Failed to decode JWT token: ", err)
            return
        end

        -- Extract claims from the decoded JWT token
        local claims = decoded_token.claims
        kong.log.debug("Extracted claims from JWT token: ", claims)

        local user_id = claims and claims.user_id

        if user_id then
            kong.service.request.set_header("X-User-ID", user_id)
            kong.log.debug("Injected X-User-ID header: ", user_id)
        else
            kong.log.err("JWT token does not contain 'user_id' claim.")
        end
    else
        kong.log.err("No JWT token found in the request context.")
    end
end

return CustomTransformer

RegisterNetEvent('astinox-elock:playSoundInWorldspace', function(name)
    local src = source
    local ped = GetPlayerPed(src)

    if ped == nil then return end;

    local coords = GetEntityCoords(ped)
    local soundName = nil
    local soundSet = nil

    if name == 'elock:success' then
        soundName = 'Hack_Success'
        soundSet = 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS'
    elseif name == 'elock:fail' then
        soundName = 'Hack_Failed'
        soundSet = 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS'
    elseif name == 'elock:click' then
        soundName = '10_SEC_WARNING'
        soundSet = 'HUD_MINI_GAME_SOUNDSET'
    end

    if soundName == nil or soundSet == nil then return end;

    TriggerClientEvent('astinox-elock:playSoundInWorldspace', -1, soundName, soundSet, coords.x, coords.y, coords.z)
end)
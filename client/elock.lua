local elock

RegisterNuiCallback('elock:success', function(_, cb)
    if not elock then return cb({}) end
    TriggerServerEvent('astinox-elock:playSoundInWorldspace', 'elock:success')
    SetNuiFocus(false, false)
    elock:resolve(true)
    elock = nil
    cb({})
end)

RegisterNuiCallback('elock:fail', function(_, cb)
    if not elock then return cb({}) end
    TriggerServerEvent('astinox-elock:playSoundInWorldspace', 'elock:fail')
    SetNuiFocus(false, false)
    elock:resolve(false)
    elock = nil
    cb({})
end)

RegisterNuiCallback('elock:click', function(_, cb)
    if not elock then return cb({}) end
    TriggerServerEvent('astinox-elock:playSoundInWorldspace', 'elock:click')
    cb({})
end)

RegisterNetEvent('astinox-elock:playSoundInWorldspace', function(soundName, soundSet, x, y, z)
    PlaySoundFromCoord(-1, soundName, x, y, z, soundSet, false, Config.range, false)
end)

local function Start()
    elock = promise.new()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'elock:start',
        gridsize = Config.gridSize,
        tries = Config.tries,
        timeout = Config.timeout,
        volume = GetProfileSetting(300) / 10
    })
    return Citizen.Await(elock)
end

exports('Start', Start)
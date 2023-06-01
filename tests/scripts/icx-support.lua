function useConstants()

end
function useAliases()

end

--класс
Device = {}
--тело класса
function Device:new()
    local public = {}
    -- метод get
    function public:get(key)
        return self[key]
    end
    -- метод set
    function public:set(key, value)
        self[key] = value
    end

    --чистая магия!
    setmetatable(public, self)
    self.__index = self;
    return public
end

d0 = Device:new()
d1 = Device:new()
d2 = Device:new()
d3 = Device:new()
d4 = Device:new()
d5 = Device:new()

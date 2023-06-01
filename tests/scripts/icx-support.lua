function useConstants()

end
function useAliases()

end

--класс
Device = {}
--тело класса
function Device:new()
    -- свойства
    local obj = {}

    --чистая магия!
    setmetatable(obj, self)
    self.__index = self;
    return obj
end

d0 = Device:new()
d1 = Device:new()
d2 = Device:new()
d3 = Device:new()
d4 = Device:new()
d5 = Device:new()

$(document).ready(function () {
    $('.delete-article').on('click', function (e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        const classid = $target.attr('data-classid');
        $.ajax({
            type: 'DELETE',
            url: '/articles/' + id,
            success: function (response) {
                alert('Deleting Article');
                window.location.href = '/articles/inClass/' + classid;
            },
            error: function (err) {
                console.log(err);
            }
        });
    })
});